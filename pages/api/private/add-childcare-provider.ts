import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"

// import mango from "../../lib/mango"

import poundsToPennies from "../../../utils/poundsToPennies"
import { prisma } from "../../../prisma/generated/ts"
import { sendProviderRegistrationLink } from "../../../utils/mailgunClient"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
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
      amountToPay: poundsToPennies(amountToPay),
      consentToPay,
      expiresAt,
      reference,
    })

    await sendProviderRegistrationLink({
      user,
      email: newChildcareProvider.email,
      amountToPay: poundsToPennies(amountToPay),
      slug: newChildcareProvider.id,
    })

    res.status(200).json({ childcareProviderId: newChildcareProvider.id })
  } catch (err) {
    console.error("Error in add-childcare-provider", err)
  }
}
