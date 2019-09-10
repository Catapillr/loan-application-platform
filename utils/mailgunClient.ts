import * as mailgun from "mailgun.js"

const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
})

export default mailgunClient
