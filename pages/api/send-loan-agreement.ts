import hellosign from "hellosign-sdk"
import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"

import { prisma } from "../../prisma/generated"

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
      annualSalary,
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

  const opts = {
    test_mode: 1 as hellosign.Flag,
    template_id: "29e550f5a23c298fa0fe85ffe93ed2c2b06f979d",
    title: "Employee loan agreement",
    subject: "Employee loan agreement",
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
        name: "loanTerms",
        value: loanTerms,
      },
      {
        name: "loanAmount",
        value: `£${loanAmount}`,
      },
    ],
  }

  helloSignClient.signatureRequest.sendWithTemplate(opts).catch(e => {
    console.error("Sending loan agreement Hellosign error: ", e) //eslint-disable-line no-console
  })

  res.status(200).end()
}
