import mangopay from "mangopay2-nodejs-sdk"
import formidable from "formidable"
import gql from "graphql-tag"
import moment from "moment"
import { NextApiRequest, NextApiResponse } from "next"
import R from "ramda"

import mango from "../../lib/mango"

import { prisma } from "../../prisma/generated/ts"
import {
  sendEmployeeLoanApproval,
  sendLoanTransferDetails,
  sendEmployeeApplicationCompleteConfirmation,
} from "../../utils/mailgunClient"

// Hellosign constants
const Signed = "signed"
const SignatureRequestSigned = "signature_request_signed"
const AwaitingSignature = "awaiting_signature"
const Employer = "Employer"
const Employee = "Employee"
const Natural = "NATURAL"
const GBP = "GBP"

type Role = "Employer" | "Employee"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields) => {
    if (err) {
      return console.error("Listen for signEvent error", err) //eslint-disable-line no-console
    }

    const signEvent = JSON.parse(fields.json as string)

    if (signEvent.event.event_type !== SignatureRequestSigned) {
      return res.status(200).send("Hello API Event Received")
    }

    const getSignature = (role: Role) =>
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
              agreementURL
            }
            employer {
              id
              name
            }
          }
        `)

        const { Id: newMangoUserId } = await mango.Users.create({
          FirstName: employee.firstName,
          LastName: employee.lastName,
          Birthday: moment(employee.dob).unix(),
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
            Amount: employee.loan.amount,
          },
          DeclaredFees: {
            Currency: GBP,
            Amount: 0,
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
        })

        return res.status(200).send("Hello API Event Received")
      } catch (err) {
        console.error("Error with creating mango payIn instance: ", err)
      }
    }
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
