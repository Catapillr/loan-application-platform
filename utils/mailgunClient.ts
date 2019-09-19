import * as mailgun from "mailgun.js"
import R from "ramda"

const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
})

const mailgunEmailTemplate = ({ email, subject, template, data }) => {
  mailgunClient.messages
    .create(
      process.env.MAILGUN_DOMAIN,
      R.merge(
        {
          from: `${process.env.MAILGUN_SENDER_NAME} <${process.env.MAILGUN_SENDER_EMAIL}>`,
          to: email,
          subject,
          template,
        },
        data
      )
    )
    .catch((err: any) => {
      console.error("Error sending email: ", err)
    })
}

const sendEmployeeEmailVerification = ({ email, random }) =>
  mailgunEmailTemplate({
    email,
    subject: "Email verification code",
    template: "email-verification",
    data: {
      "v:random": random,
    },
  })

const sendEmployeeLoanApproval = (email: string) =>
  mailgunEmailTemplate({
    email,
    subject: "Congratulations, your loan has been approved",
    template: "loan-approval",
    data: {},
  })

const convertToSterling = amount => `£${(amount / 100).toFixed(2)}`
const sendIncorrectPaymentNotification = ({ payment, user, employer }) =>
  mailgunEmailTemplate({
    email: process.env.ADMIN_EMAIL,
    subject: `An employee of ${employer.name} has been paid the wrong amount`,
    template: "incorrect-payment-notification",
    data: {
      "v:adminName": process.env.ADMIN_NAME,
      "v:userFirstName": user.firstName,
      "v:userLastName": user.lastName,
      "v:loanAmount": convertToSterling(payment.loanAmount),
      "v:payInAmount": convertToSterling(payment.payInAmount),
      "v:dateOfPayment": payment.dateOfPayment,
      "v:payInId": payment.payInId,
      "v:discrepancy": convertToSterling(payment.discrepancy),
      "v:userId": user.id,
      "v:mangoWalletId": user.mangoWalletId,
      "v:employerId": employer.id,
      "v:employerName": employer.name,
      "v:employerPayrollEmail": employer.payrollEmail,
    },
  })

const sendLoanTransferDetails = ({ email, BankDetails, WireReference }) =>
  mailgunEmailTemplate({
    email,
    subject: "Loan transfer details",
    template: "loan-transfer-details",
    data: {
      "v:BankDetails": BankDetails,
      "v:WireReference": WireReference,
    },
  })

export {
  mailgunEmailTemplate,
  sendEmployeeEmailVerification,
  sendEmployeeLoanApproval,
  sendLoanTransferDetails,
  sendIncorrectPaymentNotification,
}
