import * as mailgun from "mailgun.js"
import R from "ramda"
import convertToSterling from "../utils/convertToSterling"

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

const sendEmployerPaymentNotification = ({ payment, user, employer }) =>
  mailgunEmailTemplate({
    email: employer.payrollEmail,
    subject: `Your employee's loan has been successfully received`,
    template: "employer-payment-notification",
    data: {
      "v:userFirstName": user.firstName,
      "v:userLastName": user.lastName,
      "v:loanAmount": convertToSterling(payment.loanAmount),
      "v:dateOfPayment": payment.dateOfPayment,
    },
  })

const sendEmployeePaymentNotification = ({ payment, user }) =>
  mailgunEmailTemplate({
    email: user.email,
    subject: `Your Catapillr loan has been paid into your account!`,
    
    template: "employee-payment-notification",
    data: {
      "v:userFirstName": user.firstName,
      "v:loanAmount": convertToSterling(payment.loanAmount),
      "v:magicLink": "https://www.catapillr.com/", // TODO: Change this to magic link
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
  sendEmployerPaymentNotification,
  sendEmployeePaymentNotification,
}
