import * as mailgun from "mailgun.js"
import R from "ramda"
import convertToPounds from "../utils/convertToPounds"

const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
  url: "https://api.eu.mailgun.net",
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

const sendEmployeeApplicationCompleteConfirmation = (email: string) =>
  mailgunEmailTemplate({
    email,
    subject: "Your application is complete",
    template: "employee-application-complete",
    data: {},
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
      "v:loanAmount": convertToPounds(payment.loanAmount),
      "v:payInAmount": convertToPounds(payment.payInAmount),
      "v:dateOfPayment": payment.dateOfPayment,
      "v:payInId": payment.payInId,
      "v:discrepancy": convertToPounds(payment.discrepancy),
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
      "v:loanAmount": convertToPounds(payment.loanAmount),
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
      "v:loanAmount": convertToPounds(payment.loanAmount),
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

const sendPaymentRequestDetails = ({ user, email, amountToPay, slug }) =>
  mailgunEmailTemplate({
    email,
    subject: `${user.firstName} ${user.lastName} wants to pay you ${amountToPay}`,
    template: "payment-request-details",
    data: {
      "v:slug": slug,
      "v:userFirstName": user.firstName,
      "v:userLastName": user.lastName,
      "v:amountToPay": amountToPay,
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
  sendPaymentRequestDetails,
  sendEmployeeApplicationCompleteConfirmation,
}
