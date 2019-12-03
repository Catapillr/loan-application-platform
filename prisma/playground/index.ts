// import mangopay from "mangopay2-nodejs-sdk"
// import fs from "fs"
// import { prisma } from "../prisma/generated/ts"
// import gql from "graphql-tag"
// import R from "ramda"
// import axios from "axios"

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
