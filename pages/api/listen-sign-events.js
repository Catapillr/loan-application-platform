import formidable from "formidable"
import * as mailgun from "mailgun.js"

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
})

export default (req, res) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields) => {
    if (err) {
      console.log("Listen for sign event error", err) //eslint-disable-line no-console
    }

    const signEvent = JSON.parse(fields.json)
    try {
      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `${process.env.MAILGUN_SENDER_NAME} <${process.env.MAILGUN_SENDER_EMAIL}>`,
        to: ["lucy@infactcoop.com"],
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
