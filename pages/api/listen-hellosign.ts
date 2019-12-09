import mangopay from "mangopay2-nodejs-sdk"
import formidable from "formidable"
import gql from "graphql-tag"
import moment from "moment"
import { NextApiRequest, NextApiResponse } from "next"
import R from "ramda"
import crypto from "crypto"

import mango from "../../lib/mango"

import { prisma } from "../../prisma/generated/ts"
import {
  sendEmployeeLoanApproval,
  sendLoanTransferDetails,
  sendEmployeeApplicationCompleteConfirmation,
} from "../../utils/mailgunClient"
import calculatePlatformFees from "../../utils/calculatePlatformFees"

// Hellosign constants
const Signed = "signed"
const SignatureRequestSigned = "signature_request_signed"
const AwaitingSignature = "awaiting_signature"
const Employer = "Employer"
const Employee = "Employee"
const Natural = "NATURAL"
const GBP = "GBP"

type Role = "Employer" | "Employee"

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Listen for signEvent error", err) //eslint-disable-line no-console
      return res.status(200).send("Hello API Event Received")
    }

    const signEvent = JSON.parse(fields.json as string)

    const { event } = signEvent

    const hash = crypto
      .createHmac("sha256", process.env.HELLOSIGN_KEY)
      .update(event.event_time + event.event_type)
      .digest("hex")
      .toString()

    if (hash !== event.event_hash) {
      return res.status(401).end()
    }

    if (event.event_type !== SignatureRequestSigned) {
      return res.status(200).send("Hello API Event Received")
    }

    const getSignature = (role: Role): any =>
      R.pipe(
        R.path(["signature_request", "signatures"]),
        R.filter(R.propEq("signer_role", role)),
        R.head
      )(signEvent)

    const employerSignatureInfo = getSignature(Employer)
    const employeeSignatureInfo = getSignature(Employee)

    const employeeEmail = employeeSignatureInfo.signer_email_address
    const employerEmail = employerSignatureInfo.signer_email_address

    if (
      employeeSignatureInfo.status_code === Signed &&
      employerSignatureInfo.status_code === AwaitingSignature
    ) {
      sendEmployeeApplicationCompleteConfirmation(employeeEmail)
      return res.status(200).send("Hello API Event Received")
    }

    if (employerSignatureInfo.status_code === Signed) {
      sendEmployeeLoanApproval(employeeEmail)

      // TODO: maybe add https://github.com/firede/ts-transform-graphql-tag
      try {
        const employee: any = await prisma.user({
          email: employeeEmail,
        }).$fragment(gql`
          fragment EmployeeWithLoan on User {
            firstName
            lastName
            email
            dob
            nationality
            loan {
              amount
            }
            employer {
              id
              minimumLoanFee
            }
          }
        `)

        const { Id: newMangoUserId } = await mango.Users.create({
          FirstName: employee.firstName,
          LastName: employee.lastName,
          Birthday: moment.utc(employee.dob).unix(),
          Nationality: employee.nationality as mangopay.CountryISO,
          CountryOfResidence: "GB",
          Email: employee.email,
          PersonType: Natural,
        })

        const { Id: newWalletId } = await mango.Wallets.create({
          Owners: [newMangoUserId],
          Description: `Employee wallet - ${employee.firstName} ${employee.lastName} - mangoID: ${newMangoUserId}`,
          Currency: GBP,
        })

        const platformFees = calculatePlatformFees({
          minimumLoanFee: employee.employer.minimumLoanFee,
          loanAmount: employee.loan.amount,
        })

        const {
          Id: payInId,
          WireReference,
          BankAccount,
        } = await mango.PayIns.create({
          PaymentType: "BANK_WIRE",
          ExecutionType: "DIRECT",
          AuthorId: newMangoUserId,
          CreditedUserId: newMangoUserId,
          CreditedWalletId: newWalletId,
          DeclaredDebitedFunds: {
            Currency: GBP,
            Amount: employee.loan.amount + platformFees,
          },
          DeclaredFees: {
            Currency: GBP,
            Amount: platformFees,
          },
        })

        await prisma.updateUser({
          data: {
            mangoWalletId: newWalletId,
            mangoUserId: newMangoUserId,
            payIns: {
              create: [
                {
                  employer: { connect: { id: employee.employer.id } },
                  mangoPayInId: payInId,
                },
              ],
            },
            loan: {
              update: {
                approved: true,
                agreementURL: signEvent.signature_request.files_url,
              },
            },
          },
          where: {
            email: employee.email,
          },
        })

        const [sortCode, accountNumber] = R.splitAt(-8, BankAccount.IBAN)

        // TODO: check this in production to see if it's being split properly
        sendLoanTransferDetails({
          email: employerEmail,
          sortCode,
          accountNumber,
          bankOwnerName: BankAccount.OwnerName,
          WireReference,
          loanAmount: employee.loan.amount,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeeId: employee.employeeId,
          fees: `${platformFees / 1.2}`,
          feesPlusVAT: platformFees,
          totalPayInAmount: employee.loan.amount + platformFees,
        })

        return res.status(200).send("Hello API Event Received")
      } catch (err) {
        const error = {
          error: err,
          url: `${process.env.HOST}/api/listen-hellosign`,
          time: new Date().toISOString(),
          signEvent,
          employeeEmail,
        }

        // eslint-disable-next-line no-console
        console.error("Error with creating mango payIn instance: ", error)
      }
    }
    return res.status(200).send("Hello API Event Received")
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
