import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import * as crypto from "crypto"

import { prisma } from "../../prisma/generated"

import mailgunClient from "../../utils/mailgunClient"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, expiryHours = 24 } = req.body
    const random = crypto.randomBytes(6).toString("hex")
    const expiresAt = moment()
      .add(expiryHours, "hours")
      .toDate()

    const tokenExists = await prisma.$exists.verificationToken({ email })

    const token = tokenExists
      ? await prisma.updateVerificationToken({
          data: {
            expiresAt,
            token: random,
          },
          where: {
            email,
          },
        })
      : await prisma.createVerificationToken({
          email,
          expiresAt,
          token: random,
        })

    await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `${process.env.MAILGUN_SENDER_NAME} <${process.env.MAILGUN_SENDER_EMAIL}>`,
      to: [email],
      subject: `Your email token is ${random}`,
      text: `Hi there! To continue signing up to Catapillr's interest-free childcare loan, please enter the following code: ${random} . Thank you! Phil`,
      html: `<h2>Welcome to Catapillr</h2> <p>To continue signing up to Catapillr's interest-free childcare loan, please enter the following code:</p> <p><b>${random}</b></p> <p>Thank you!</p> <p>Phil</p>`,
    })

    return res.status(200).json({ token })
  } catch (e) {
    console.log("There was an error creating an email token: ", e) //eslint-disable-line no-console
  }
}
