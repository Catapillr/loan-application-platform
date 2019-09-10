import { NextApiRequest, NextApiResponse } from "next"

import hellosign from "hellosign-sdk"

const helloSignClient = hellosign({
  key: process.env.HELLOSIGN_KEY,
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      loanTerms,
      loanAmount,
      name,
      email,
      employerName,
      employerEmail,
    } = req.body

    const opts = {
      test_mode: 1 as hellosign.Flag,
      template_id: "29e550f5a23c298fa0fe85ffe93ed2c2b06f979d",
      title: "Employee loan agreement",
      subject: "Employee loan agreement",
      signers: [
        {
          email_address: email,
          name,
          role: "Employee",
        },
        {
          email_address: employerEmail,
          name: employerName,
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

    const helloSignRes = await helloSignClient.signatureRequest.sendWithTemplate(
      opts
    )

    console.log("Template sent: ", JSON.stringify(helloSignRes, undefined, 2)) //eslint-disable-line no-console
    res.status(200).end()
  } catch (e) {
    console.log("Loan agreement error: ", e) //eslint-disable-line no-console
    res.status(400).end()
  }
}
