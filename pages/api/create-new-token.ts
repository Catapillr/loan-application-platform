import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import * as crypto from "crypto"

import { prisma } from "../../prisma/generated"

import { employeeEmailVerification } from "../../utils/mailgunClient"



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

    await employeeEmailVerification({ email, random })

    return res.status(200).json({ token })
  } catch (e) {
    console.log("There was an error creating an email token: ", e) //eslint-disable-line no-console
  }
}
