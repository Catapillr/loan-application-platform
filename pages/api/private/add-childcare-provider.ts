import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"

// import mango from "../../lib/mango"

import poundsToPennies from "../../../utils/poundsToPennies"
import { prisma } from "../../../prisma/generated/ts"
import { sendPaymentRequestDetails } from "../../../utils/mailgunClient"

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

  const newPaymentRequest = await prisma.createPaymentRequest({
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
    amountToPay: poundsToPennies(amountToPay),
    consentToPay,
    expiresAt,
    reference,
  })

  sendPaymentRequestDetails({
    user,
    email: newChildcareProvider.email,
    amountToPay: poundsToPennies(amountToPay),
    slug: newPaymentRequest.id,
  })

  res.status(200).json({ childcareProviderId: newChildcareProvider.id })
}
