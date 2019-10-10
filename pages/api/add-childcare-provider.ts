import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import mangopay from "mangopay2-nodejs-sdk"

const mango = new mangopay({
  clientId: process.env.MANGO_CLIENT_ID,
  clientApiKey: process.env.MANGO_KEY,
  // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
  // baseUrl: "https://api.mangopay.com",
})

import { prisma } from "../../prisma/generated/ts"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { providerEmail, companyNumber, expiryDays = 7 } = req.body

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

  res.status(200).json({ childcareProviderId: newChildcareProvider.id })
}
