import { prisma } from "../../prisma/generated"
import * as moment from "moment"
import * as mailgun from "mailgun.js"

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API || "",
})

// eslint-disable-next-line
const crypto = require("crypto")

export default async (req, res) => {
  try {
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

    const sendToken = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `${process.env.MAILGUN_SENDER_NAME} <${process.env.MAILGUN_SENDER_EMAIL}>`,
      to: [email],
      subject: `Your email token is ${random}`,
      text: `Hi there! To continue signing up to Catapillr's interest-free childcare loan, please enter the following code: ${random} . Thank you! Phil`,
      html: `<h2>Welcome to Catapillr</h2> <p>To continue signing up to Catapillr's interest-free childcare loan, please enter the following code:</p> <p><b>${random}</b></p> <p>Thank you!</p> <p>Phil</p>`,
    })

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    return res.json({ token })
  } catch (e) {
    console.log("There was an error creating an email token: ", e)
  }
}
