import hellosign from "hellosign-sdk"
import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import * as R from "ramda"
import R_ from "../../utils/R_"

import zeroIndexMonth from "../../utils/zeroIndexMonth"
import poundsToPennies from "../../utils/poundsToPennies"
import currencyFormatter from "currency-formatter"

import { prisma } from "../../prisma/generated/ts"

const helloSignClient = hellosign({
  key: process.env.HELLOSIGN_KEY,
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    employmentStartDate,
    email,
    annualSalary,
    loanAmount,
    loanTerms,
    firstName,
    lastName,
    dob,
    nationality,
    employeeID,
    phoneNumber,
    employer,
    gdprConsent,
  } = req.body

  prisma
    .createUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      dob: moment(zeroIndexMonth(dob)).toDate(),
      nationality,
      employmentStartDate: moment(zeroIndexMonth(employmentStartDate)).toDate(),
      employeeID,
      annualSalary: poundsToPennies(parseFloat(annualSalary)),
      employer: { connect: { slug: employer.slug } },
      loan: {
        create: {
          amount: poundsToPennies(loanAmount),
          terms: parseInt(loanTerms),
        },
      },
      gdprConsent,
    })
    .catch(e => {
      console.error("Error creating prisma user: ", e) //eslint-disable-line no-console
    })

  const loanOptions = (
    loanAmount: number,
    loanTerms: number,
    maximumTerms: number = 11
  ): { name: string; value: any }[] => {
    const monthlyRepayment = Math.floor(loanAmount / loanTerms)
    const remainder = loanAmount % loanTerms
    const firstMonth = monthlyRepayment + remainder

    const loanDetails = [
      {
        name: "loanAmount",
        value: currencyFormatter.format(loanAmount, { code: "GBP" }),
      },
      {
        name: "loanTerms",
        value: loanTerms,
      },
      {
        name: "loanMonthlyRepayment",
        value: currencyFormatter.format(monthlyRepayment, { code: "GBP" }),
      },
    ]

    const loanMonths = R_.mapIndexed((_: any, index: any) => ({
      name: `loanMonth${index + 1}`,
      value: `${
        index === 0
          ? `${currencyFormatter.format(firstMonth, { code: "GBP" })}`
          : `${currencyFormatter.format(monthlyRepayment, { code: "GBP" })}`
      }`,
    }))([...Array(loanTerms)])

    const defaultMonths = R_.mapIndexed((_: any, index: any) => ({
      name: `loanMonth${loanTerms + index + 1}`,
      value: "n/a",
    }))([...Array(maximumTerms - loanTerms)])

    // @ts-ignore
    return [...loanDetails, ...loanMonths, ...defaultMonths]
  }

  const opts = {
    test_mode: 1 as hellosign.Flag,
    template_id: "f7d22e065f90856421dc4d0f4b0257783a22c356",
    title: "Employee CCAS loan agreement",
    subject: "Employee CCAS loan agreement",
    signers: [
      {
        email_address: email,
        name: `${firstName} ${lastName} `,
        role: "Employee",
      },
      {
        email_address: employer.signerEmail,
        name: employer.name,
        role: "Employer",
      },
    ],
    custom_fields: [
      {
        name: "employerName",
        value: employer.name,
      },
      {
        name: "employerCompanyNumber",
        value: employer.companyNumber || "n/a",
      },
      {
        name: "employerAddress",
        value: employer.address,
      },
      {
        name: "userName",
        value: `${firstName} ${lastName} `,
      },
      {
        name: "userEmployeeID",
        value: `${employeeID && employeeID !== "" ? employeeID : "n/a"} `,
      },
      ...loanOptions(parseInt(loanAmount), parseInt(loanTerms)),
    ],
  }

  helloSignClient.signatureRequest.sendWithTemplate(opts).catch(e => {
    console.error("Sending loan agreement Hellosign error: ", e) //eslint-disable-line no-console
  })

  res.status(200).end()
}
