import formidable from "formidable"
import gql from "graphql-tag"
import mangopay from "mangopay2-nodejs-sdk"
import moment from "moment"
import { NextApiRequest, NextApiResponse } from "next"
import R from "ramda"

import { prisma } from "../../prisma/generated/ts"
import {
  sendEmployeeLoanApproval,
  sendLoanTransferDetails,
} from "../../utils/mailgunClient"

// Hellosign constants
const Signed = "signed"
const SignatureRequestSigned = "signature_request_signed"
const Employer = "Employer"
const Employee = "Employee"
const Natural = "NATURAL"
const GBP = "GBP"

type Role = "Employer" | "Employee"

const mango = new mangopay({
  clientId: process.env.MANGO_CLIENT_ID,
  clientApiKey: process.env.MANGO_KEY,
  // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
  // baseUrl: "https://api.mangopay.com",
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields) => {
    if (err) {
      return console.log("Listen for signEvent error", err) //eslint-disable-line no-console
    }

    const signEvent = JSON.parse(fields.json as string)

    // TODO: check for event signature_request_all_signed
    if (signEvent.event.event_type !== SignatureRequestSigned) return

    const getSignature = (role: Role) =>
      R.pipe(
        R.path(["signature_request", "signatures"]),
        R.filter(R.propEq("signer_role", role)),
        R.head
      )(signEvent)

    const employerSignature = getSignature(Employer)

    // TODO: if above event check field for downloadable PDF so we can put that in loan table under agreementURL
    if (employerSignature.status_code === Signed) {
      const employeeSignature = getSignature(Employee)
      const employeeEmail = employeeSignature.signer_email_address
      const employerEmail = employerSignature.signer_email_address

      // 1. email to employee
      sendEmployeeLoanApproval(employeeEmail)

      // 2. create employee e-wallet

      // TODO: maybe add https://github.com/firede/ts-transform-graphql-tag
      try {
        const employeeWithLoanFragment = gql`
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
          }
        `

        const employee: any = await prisma
          .user({
            email: employeeEmail,
          })
          .$fragment(employeeWithLoanFragment)

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

        const addToDB = await prisma.updateUser({
          data: {
            mangoWalletId: newWalletId as string,
            mangoUserId: newMangoUserId as string,
          },
          where: {
            email: employeeEmail as string,
          },
        })

        const { WireReference, BankAccount } = await mango.PayIns.create({
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

        // 3. send e-wallet account details to employer
        sendLoanTransferDetails({
          email: employerEmail,
          BankDetails: JSON.stringify(BankAccount, undefined, 2),
          WireReference,
        })
      } catch (err) {
        console.error("Error with creating mango payIn instance: ", err)
      }
    }
  })

  res.status(200).send("Hello API Event Received")
}

export const config = {
  api: {
    bodyParser: false,
  },
}
