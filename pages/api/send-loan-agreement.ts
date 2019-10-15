import hellosign from "hellosign-sdk"
import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import * as R from "ramda"

import { prisma } from "../../prisma/generated/ts"
import { userInfo } from "os"
import convertToPounds from "../../utils/convertToPounds"

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
  } = req.body

  prisma
    .createUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      dob: moment(dob).toDate(),
      nationality,
      employmentStartDate: moment(employmentStartDate).toDate(),
      employeeID,
      annualSalary: parseFloat(annualSalary),
      employer: { connect: { slug: employer.slug } },
      loan: {
        create: {
          amount: loanAmount,
          terms: parseInt(loanTerms),
        },
      },
    })
    .catch(e => {
      console.error("Error creating prisma user: ", e) //eslint-disable-line no-console
    })

  const loanOptions = (
    loanAmount: number,
    loanTerms: number,
    maximumTerms: number = 12
  ): { name: string; value: any }[] => {
    const mapIndexed = R.addIndex(R.map)

    const monthlyRepayment = Math.floor(loanAmount / loanTerms)
    const remainder = loanAmount % loanTerms
    const lastMonth = monthlyRepayment + remainder

    const loanDetails = [
      {
        name: "loanAmount",
        value: loanAmount,
      },
      {
        name: "loanTerms",
        value: loanTerms,
      },
      {
        name: "loanMonthlyRepayment",
        value: convertToPounds(monthlyRepayment),
      },
    ]

    const loanMonths = mapIndexed((_, index) => ({
      name: `loanMonth${index + 1}`,
      value: `${
        index + 1 === loanTerms
          ? convertToPounds(lastMonth)
          : convertToPounds(monthlyRepayment)
      }`,
    }))([...Array(loanTerms)])

    const defaultMonths = mapIndexed((_, index) => ({
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
        name: `${firstName} ${lastName}`,
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
        value: `${firstName} ${lastName}`,
      },
      {
        name: "userEmployeeID",
        value: `${employeeID && employeeID !== "" ? employeeID : "n/a"}`,
      },
      ...loanOptions(parseInt(loanAmount), parseInt(loanTerms)),
    ],
  }

  helloSignClient.signatureRequest.sendWithTemplate(opts).catch(e => {
    console.error("Sending loan agreement Hellosign error: ", e) //eslint-disable-line no-console
  })

  res.status(200).end()
}
