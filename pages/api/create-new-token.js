import { prisma } from "../../prisma/generated"
import * as moment from "moment"

// eslint-disable-next-line
const crypto = require("crypto")

export default async (req, res) => {
  const { email, expiryHours = 24 } = req.body
  const random = crypto.randomBytes(6).toString("hex")
  const expiresAt = moment().add(expiryHours, "hours")

  const tokenExists = !!(await prisma.verificationToken({ email }))

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

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  return res.json({ token })
}
