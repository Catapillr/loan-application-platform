import hellosign from "hellosign-sdk"
import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"

import { prisma } from "../../prisma/generated/ts"
import { userInfo } from "os"
import convertToSterling from "../../utils/convertToSterling"

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

  const loanOptions = (loanAmount, loanTerms) => {
    const pureRepayment = loanAmount / loanTerms
    const monthlyRepayment = Math.floor(pureRepayment)
    const remainder = loanAmount % loanTerms
    const lastMonth = monthlyRepayment + remainder

    const months = new Array(loanTerms).map((month, index) => {
      return {
        name: `month${month}`,
        value: `${
          index === loanTerms - 1
            ? convertToSterling(lastMonth)
            : convertToSterling(monthlyRepayment)
        }`,
      }
    })

    return [
      {
        name: "loanAmount",
        value: loanAmount,
      },
      {
        name: "loanTerms",
        value: loanTerms,
      },
      {
        name: "monthlyRepayment",
        value: convertToSterling(monthlyRepayment),
      },
      {
        name: "month11",
        value: "n/a",
      },
      {
        name: "month12",
        value: "n/a",
      },
      ...months,
    ]
  }

  const opts = {
    test_mode: 1 as hellosign.Flag,
    template_id: "29e550f5a23c298fa0fe85ffe93ed2c2b06f979d",
    title: "Employee loan agreement",
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
        value: employer.name,
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
      ...loanOptions(loanAmount, loanTerms),
    ],
  }

  helloSignClient.signatureRequest.sendWithTemplate(opts).catch(e => {
    console.error("Sending loan agreement Hellosign error: ", e) //eslint-disable-line no-console
  })

  res.status(200).end()
}
