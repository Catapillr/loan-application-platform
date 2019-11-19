import * as mailgun from "mailgun.js"
import R from "ramda"
import penniesToPounds from "./penniesToPounds"
import formatToGBP from "./formatToGBP"

// all financial amounts should come into this file as pennies and be converted
// to pounds before sending

const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
  url: "https://api.eu.mailgun.net",
})

// TODO: await emails all over
const mailgunEmailTemplate = ({ email, subject, template, data }) =>
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
      "v:loanAmount": formatToGBP(penniesToPounds(payment.loanAmount)),
      "v:payInAmount": formatToGBP(penniesToPounds(payment.payInAmount)),
      "v:dateOfPayment": payment.dateOfPayment,
      "v:payInId": payment.payInId,
      "v:discrepancy": formatToGBP(penniesToPounds(payment.discrepancy)),
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
      "v:loanAmount": formatToGBP(penniesToPounds(payment.loanAmount)),
      "v:dateOfPayment": payment.dateOfPayment,
    },
  })

const sendEmployeeLoanPaymentNotification = ({ payment, user }) =>
  mailgunEmailTemplate({
    email: user.email,
    subject: `Your Catapillr loan has been paid into your account!`,

    template: "employee-payment-notification",
    data: {
      "v:userFirstName": user.firstName,
      "v:loanAmount": formatToGBP(penniesToPounds(payment.loanAmount)),
      "v:magicLink": "https://app.catapillr.com/dashboard", // TODO: Change this to magic link
    },
  })

const sendLoanTransferDetails = ({
  email,
  sortCode,
  accountNumber,
  bankOwnerName,
  WireReference,
  loanAmount,
  employeeName,
  fees,
  feesPlusVAT,
  totalPayInAmount,
}) =>
  mailgunEmailTemplate({
    email,
    subject: "Loan transfer details",
    template: "loan-transfer-details",
    data: {
      "v:sortCode": sortCode,
      "v:accountNumber": accountNumber,
      "v:bankOwnerName": bankOwnerName,
      "v:loanAmount": formatToGBP(penniesToPounds(loanAmount)),
      "v:WireReference": WireReference,
      "v:employeeName": employeeName,
      "v:fees": formatToGBP(penniesToPounds(fees)),
      "v:feesPlusVAT": formatToGBP(penniesToPounds(feesPlusVAT)),
      "v:totalPayInAmount": formatToGBP(penniesToPounds(totalPayInAmount)),
    },
  })

const sendProviderRegistrationLink = ({ user, email, amountToPay, slug }) =>
  mailgunEmailTemplate({
    email,
    subject: `${user.firstName} ${user.lastName} wants to pay you ${formatToGBP(
      penniesToPounds(amountToPay)
    )}`,
    template: "provider-registration-link",
    data: {
      "v:slug": slug,
      "v:userFirstName": user.firstName,
      "v:userLastName": user.lastName,
      "v:amountToPay": formatToGBP(penniesToPounds(amountToPay)),
    },
  })

const sendProviderApplicationCompleteConfirmation = ({ email }) =>
  mailgunEmailTemplate({
    email,
    subject: "We have successfully received your payment details!",
    template: "provider-application-complete",
    data: {},
  })

const sendProviderPaymentNotification = ({
  email,
  amountToPay,
  employeeName,
}) =>
  mailgunEmailTemplate({
    email,
    subject: "Payment notification",
    template: "provider-payment-notification",
    data: {
      "v:amountToPay": formatToGBP(penniesToPounds(amountToPay)),
      "v:employeeName": employeeName,
    },
  })

// TODO: add provider name to this template
const sendEmployeeOutgoingPaymentNotification = ({
  email,
  amountToPay,
  // providerName,
}) =>
  mailgunEmailTemplate({
    email,
    subject: "Outgoing payment",
    template: "employee-outgoing-payment-notification",
    data: {
      "v:amountToPay": formatToGBP(penniesToPounds(amountToPay)),
      // "v:providerName": providerName,
    },
  })

const sendKYCorUBOFailure = (failureReasons: any) =>
  mailgunEmailTemplate({
    email: process.env.ADMIN_EMAIL,
    subject: "There was an error with childcare provider registration",
    template: "send-kyc-or-ubo-failure",
    data: {
      "v:failureReasons": JSON.stringify(failureReasons, undefined, 2),
    },
  })

export {
  mailgunEmailTemplate,
  sendEmployeeEmailVerification,
  sendEmployeeLoanApproval,
  sendLoanTransferDetails,
  sendIncorrectPaymentNotification,
  sendEmployerPaymentNotification,
  sendEmployeeLoanPaymentNotification,
  sendProviderRegistrationLink,
  sendEmployeeApplicationCompleteConfirmation,
  sendProviderPaymentNotification,
  sendEmployeeOutgoingPaymentNotification,
  sendKYCorUBOFailure,
  sendProviderApplicationCompleteConfirmation,
}
