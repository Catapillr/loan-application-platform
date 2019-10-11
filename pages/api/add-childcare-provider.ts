import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
// import mangopay from "mangopay2-nodejs-sdk"

// const mango = new mangopay({
//   clientId: process.env.MANGO_CLIENT_ID,
//   clientApiKey: process.env.MANGO_KEY,
//   // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
//   // baseUrl: "https://api.mangopay.com",
// })

import { prisma } from "../../prisma/generated/ts"
import { sendPaymentRequestDetails } from "../../utils/mailgunClient"
import convertToPennies from "../../utils/convertToPennies"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const user = req.user
  const {
    providerEmail,
    companyNumber,
    expiryDays = 7,
    amountToPay,
    consentToPay,
    reference,
  } = req.body

  const expiresAt = moment()
    .add(expiryDays, "days")
    .toDate()

  // const { Id: newWalletId } = await mango.Wallets.create({
  //   Owners: [newMangoUserId],
  //   Description: `Employee wallet - ${employee.firstName} ${employee.lastName} - mangoID: ${newMangoUserId}`,
  //   Currency: GBP,
  // })
  //
  // const { Id: newWalletId } = await mango.Wallets.create({
  //   Owners: [newMangoUserId],
  //   Description: `Employee wallet - ${employee.firstName} ${employee.lastName} - mangoID: ${newMangoUserId}`,
  //   Currency: GBP,
  // })

  const newChildcareProvider = await prisma.createChildcareProvider({
    email: providerEmail,
    companyNumber,
    expiresAt,
    approved: false,
  })

  await prisma.createPaymentRequest({
    user: {
      connect: {
        email: user.email,
      },
    },
    childcareProvider: {
      connect: {
        id: newChildcareProvider.id,
      },
    },
    amountToPay: convertToPennies(amountToPay),
    consentToPay,
    expiresAt,
    reference,
  })

  sendPaymentRequestDetails({
    user,
    email: newChildcareProvider.email,
    amountToPay,
    slug: newChildcareProvider.id,
  })

  res.status(200).json({ childcareProviderId: newChildcareProvider.id })
}
