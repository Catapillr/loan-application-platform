import { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"

import mailgunClient from "../../utils/mailgunClient"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields) => {
    if (err) {
      console.log("Listen for sign event error", err) //eslint-disable-line no-console
    }

    const signEvent = JSON.parse(fields.json as string)
    try {
      await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `${process.env.MAILGUN_SENDER_NAME} <${process.env.MAILGUN_SENDER_EMAIL}>`,
        to: ["ivan@infactcoop.com"],
        subject: "Sign event fired",
        text: "",
        html: `<h2>Welcome to Catapillr</h2> <p>To continue signing up to Catapillr's interest-free childcare loan, please enter the following code:</p> <p><pre>${JSON.stringify(
          signEvent,
          undefined,
          2
        )}</pre></p> <p>Thank you!</p> <p>Phil</p>`,
      })

      res.status(200).send("Hello API Event Received")
    } catch (e) {
      console.log("Mailgun sending error", e) //eslint-disable-line no-console
    }
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}