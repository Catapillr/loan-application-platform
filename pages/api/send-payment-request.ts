import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import mangopay from "mangopay2-nodejs-sdk"

import { prisma } from "../../prisma/generated/ts"
import convertToPennies from "../../utils/convertToPennies"

import { sendPaymentRequestDetails } from "../../utils/mailgunClient"

const mango = new mangopay({
  clientId: process.env.MANGO_CLIENT_ID,
  clientApiKey: process.env.MANGO_KEY,
  // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
  // baseUrl: "https://api.mangopay.com",
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const user = req.user
  const {
    childcareProviderId,
    amountToPay,
    consentToPay,
    reference,
    isProviderRegistered,
    expiryDays = 7,
  } = req.body

  const expiresAt = moment()
    .add(expiryDays, "days")
    .toDate()

  try {
    const childcareProvider = await prisma.childcareProvider({
      id: childcareProviderId,
    })

    // const paymentRequest = await prisma.createPaymentRequest({

    await prisma.createPaymentRequest({
      user: {
        connect: {
          email: user.email,
        },
      },
      childcareProvider: {
        connect: {
          id: childcareProvider.id,
        },
      },
      amountToPay: convertToPennies(amountToPay),
      consentToPay,
      expiresAt,
      reference,
    })

    // for when provider is already registered

    const transfer = await mango.Transfers.create({
      AuthorId: user.mangoUserId,
      DebitedFunds: {
        Currency: "GBP",
        Amount: convertToPennies(amountToPay),
      },
      Fees: {
        Currency: "GBP",
        Amount: 0,
      },
      DebitedWalletId: user.mangoWalletId,
      CreditedWalletId: childcareProvider.mangoWalletId,
    })

    const bankAccount = await mango.Users.getBankAccount(
      childcareProvider.mangoLegalUserID,
      childcareProvider.mangoBankAccountID
    )
    // TODO: potentially add id that comes back from transfer to database

    //    {
    // Id: '69774277',
    // Tag: null,
    // CreationDate: 1570639563,
    // AuthorId: '68516446',
    // CreditedUserId: '69681155',
    // DebitedFunds: { Currency: 'GBP', Amount: 12300 },
    // CreditedFunds: { Currency: 'GBP', Amount: 12300 },
    // Fees: { Currency: 'GBP', Amount: 0 },
    // Status: 'SUCCEEDED',
    // ResultCode: '000000',
    // ResultMessage: 'Success',
    // ExecutionDate: 1570639563,
    // Type: 'TRANSFER',
    // Nature: 'REGULAR',
    // DebitedWalletId: '68516447',
    // CreditedWalletId: '69681266' }

    mango.PayOuts.create({
      AuthorId: childcareProvider.mangoLegalUserID,
      DebitedFunds: {
        Currency: "GBP",
        Amount: convertToPennies(amountToPay),
      },
      Fees: {
        Currency: "GBP",
        Amount: 0,
      },
      BankAccountId: bankAccount.Id,
      DebitedWalletId: childcareProvider.mangoWalletId,
      BankWireRef: reference,
      // @ts-ignore
      PaymentType: "BANK_WIRE",
    }).then(console.log)

    // TODO: check slug is working properly
    // TODO: send different email if provider already registered
    !isProviderRegistered &&
      sendPaymentRequestDetails({
        user,
        email: childcareProvider.email,
        amountToPay,
        slug: childcareProvider.id,
      })

    // res.status(200).json({ paymentRequest, newChildcareProvider })
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(400).end()
  }
}
