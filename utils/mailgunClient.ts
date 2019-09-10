import * as mailgun from "mailgun.js"
import r from "ramda"

const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
})

const mailgunEmailTemplate = ({ email, subject, template, data }) => {
  mailgunClient.messages.create(
    process.env.MAILGUN_DOMAIN,
    r.merge(
      {
        from: `${process.env.MAILGUN_SENDER_NAME} <${process.env.MAILGUN_SENDER_EMAIL}>`,
        to: email,
        subject,
        template,
      },
      data
    )
  )
}

const employeeEmailVerification = ({ email, random }) =>
  mailgunEmailTemplate({
    email,
    subject: "Email verification code",
    template: "email-verification",
    data: {
      "v:random": random,
    },
  })

const employeeLoanApprovalNotification = email =>
  mailgunEmailTemplate({
    email,
    subject: "Congratulations, your loan has been approved",
    template: "loan-approval",
    data: {},
  })

export {
  mailgunEmailTemplate,
  employeeEmailVerification,
  employeeLoanApprovalNotification,
}
