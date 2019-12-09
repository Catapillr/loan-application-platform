// import mangopay from "mangopay2-nodejs-sdk"
// import fs from "fs"
// import { prisma } from "../prisma/generated/ts"
// import gql from "graphql-tag"
// import R from "ramda"
// import axios from "axios"

// import { prisma } from "../generated/ts"
import mango from "../../lib/mango"

// import poundsToPennies from "../../utils/poundsToPennies"

const run = (): any => {
  mango.Hooks.getAll()
    .then(hooks =>
      hooks.map(hook =>
        mango.Hooks.update({
          ...hook,
          Url: "https://69373a40.eu.ngrok.io/api/listen-mango",
          //@ts-ignore
          Status: "ENABLED",
        })
      )
    )
    .then(hookPromises => Promise.all(hookPromises))
    .then(
      // eslint-disable-next-line
      console.log
    )
}

run()

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// const run = async () => {
//   try {
//     const user = await prisma.user({ email: "ivan@infactcoop.com" })
//
//     const reference = "Hello"
//     const amountToPay = 100000
//
//     const { Status, ResultMessage } = await mango.Transfers.create({
//       AuthorId: user.mangoUserId,
//       DebitedFunds: {
//         Currency: "GBP",
//         Amount: poundsToPennies(amountToPay),
//       },
//       Fees: {
//         Currency: "GBP",
//         Amount: 0,
//       },
//       DebitedWalletId: user.mangoWalletId,
//       CreditedWalletId: process.env.TAX_FREE_WALLET_ID,
//     })
//
//     const FAILED = "FAILED"
//     const INSUFFICIENT_BALANCE = "Unsufficient wallet balance"
//
//     if (Status === FAILED && ResultMessage === INSUFFICIENT_BALANCE) {
//       return res
//         .status(400)
//         .json({ status: FAILED, reason: INSUFFICIENT_BALANCE })
//     }
//
//     await mango.PayOuts.create({
//       AuthorId: process.env.TAX_FREE_ACCOUNT_USER_ID,
//       DebitedFunds: {
//         Currency: "GBP",
//         Amount: poundsToPennies(amountToPay),
//       },
//       Fees: {
//         Currency: "GBP",
//         Amount: 0,
//       },
//       BankAccountId: process.env.TAX_FREE_BANK_ACCOUNT_ID,
//       DebitedWalletId: process.env.TAX_FREE_WALLET_ID,
//       BankWireRef: reference,
//       // @ts-ignore
//       PaymentType: "BANK_WIRE",
//     })

// await sendProviderPaymentNotification({
//   email: provider.email,
//   amountToPay: paymentRequest.amountToPay,
//   employeeName: `${paymentRequest.user.firstName} ${paymentRequest.user.lastName}`,
// })
//
// await sendEmployeeOutgoingPaymentNotification({
//   email: paymentRequest.user.email,
//   amountToPay: paymentRequest.amountToPay,
// })
//   } catch (err) {
//     //eslint-disable-next-line no-console
//     console.error(
//       "Error when paying out to tax free account server: ",
//       JSON.stringify(err, undefined, 2)
//     )
//   }
// }
//
// run()

// import mango from "../../lib/mango"

// mango.Clients.getClientWallets().then(console.log)

// // const mango = new mangopay({
// //   clientId: process.env.MANGO_CLIENT_ID,
// //   clientApiKey: process.env.MANGO_KEY,
//   // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
//   // baseUrl: "https://api.mangopay.com",
// })

// mango.PayIns.create({
//   PaymentType: "BANK_WIRE",
//   ExecutionType: "DIRECT",
//   AuthorId: "68516446",
//   CreditedWalletId: "68516447",
//   DeclaredDebitedFunds: {
//     Currency: "GBP",
//     Amount: 10,
//   },
//   DeclaredFees: {
//     Currency: "GBP",
//     Amount: 0,
//   },
//   // @ts-ignore
//   StatementDescriptor: "Hello there",
// }).then(console.log)

// mango.PayIns.get("70071265").then(console.log)

// mango.PayOuts.create({
// AuthorId: "68516446",
// BankAccountId: "",
//   DebitedWalletId: "",
//   BankWireRef: "",
//   Tag: "",
//   DebitedFunds: {
//     Currency: "GBP",
//     Amount: 1000000000000,
//   },
//
//   Fees: {
//     Currency: "GBP",
//     Amount: 0,
//   },
// })

// mango.Transfers.create({
//   AuthorId: "68516446",
//   DebitedFunds: {
//     Currency: "GBP",
//     Amount: 11000,
//   },
//   Fees: {
//     Currency: "GBP",
//     Amount: 0,
//   },
//   DebitedWalletId: "68516447",
//   CreditedWalletId: "69681266",
// }).then(console.log)

// mango.Users.create({
//   LegalPersonType: "BUSINESS",
//   PersonType: "LEGAL",
//   Name: "InFact",
//   HeadquartersAddress: {
//     AddressLine1: "149 Fonthill Road",
//     AddressLine2: "",
//     City: "London",
//     Region: "",
//     PostalCode: "N4 3HF",
//     Country: "GB",
//   },
//   LegalRepresentativeBirthday: 1463496101,
//   LegalRepresentativeCountryOfResidence: "GB",
//   LegalRepresentativeNationality: "GB",
//   LegalRepresentativeFirstName: "Maximus",
//   LegalRepresentativeLastName: "Gerber",
//   Email: "hello@infactcoop.com",
//   CompanyNumber: "LU72HN11",
// }).then(console.log)

// mango.Wallets.create({
//   Owners: ["69681155"],
//   Description: "InFact wallet",
//   Currency: "GBP",
// }).then(console.log)

// mango.PayIns.create({
//   PaymentType: "BANK_WIRE",
//   ExecutionType: "DIRECT",
//   AuthorId: "68516446",
//   CreditedWalletId: "68516447",
//   DeclaredDebitedFunds: {
//     Currency: "GBP",
//     Amount: 10,
//   },
//   DeclaredFees: {
//     Currency: "GBP",
//     Amount: 0,
//   },
//   // @ts-ignore
//   StatementDescriptor: "Hello there",
// }).then(console.log)

// mango.PayIns.get("70070970")
// mango.Users.get("70314392").then(console.log)

// prisma
//   .childcareProvider({
//     companyNumber: "11893649",
//   })
//   .paymentRequests({ where: { expiresAt_gt: new Date().toISOString() } })
//   .then(console.log)
