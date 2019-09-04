const hellosign = require("hellosign-sdk")({
  key: process.env.HELLOSIGN_KEY,
})

export default async (req, res) => {
  try {
    const { loanTerms, loanAmount, name } = req.body

    const opts = {
      test_mode: 1,
      template_id: "29e550f5a23c298fa0fe85ffe93ed2c2b06f979d",
      title: "Employee loan agreement",
      subject: "Employee loan agreement",
      signers: [
        {
          email_address: "catapillr@protonmail.com",
          name,
          role: "Employee",
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

    await hellosign.signatureRequest
      .sendWithTemplate(opts)
      .then(res => {
        console.log(JSON.stringify(res, undefined, 2)) //eslint-disable-line no-console
        // handle response
      })
      .catch(err => {
        console.log(JSON.stringify(err, undefined, 2)) //eslint-disable-line no-console
        // handle error
      })

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    return res.json({ success: true })
  } catch (e) {
    console.log("Loan agreement error: ", e) //eslint-disable-line no-console
  }
}
