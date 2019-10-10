import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import * as crypto from "crypto"

import { prisma } from "../../prisma/generated/ts"

import { sendPaymentRequestDetails } from "../../utils/mailgunClient"
import convertToPennies from "../../utils/convertToPennies"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    childcareProvider: { providerEmail, companyNumber },
    paymentRequest: { amountToPay, consentToPay, reference },
    user,
    expiryDays = 7,
  } = req.body

  const expiresAt = moment()
    .add(expiryDays, "days")
    .toDate()

  const newChildcareProvider = await prisma.createChildcareProvider({
    email: providerEmail,
    companyNumber,
    expiresAt,
    approved: false,
  })

  const paymentRequest = await prisma.createPaymentRequest({
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
    email: providerEmail,
    amountToPay,
    slug: paymentRequest.id,
  })

  res.status(200).json({ paymentRequest, newChildcareProvider })
}
