import { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"

import { employeeLoanApprovalNotification } from "../../utils/mailgunClient"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields) => {

    if (err) {
      console.log("Listen for sign event error", err) //eslint-disable-line no-console
    }

    const signEvent = JSON.parse(fields.json as string)
    const Signed = "signed"
    const {
      signature_request: { signatures: [employeeSignature, employerSignature] }
    } = signEvent


    // when employer signs:
    if (employerSignature.status_code === Signed) {

      // 1. email to employee
      try {
        await employeeLoanApprovalNotification(employeeSignature.signer_email_address)
      } catch (e) {
        console.log("Mailgun sending error", e) //eslint-disable-line no-console
      }

      // 2. create employee e-wallet
      // 3. send e-wallet account details to employer

      res.status(200).send("Hello API Event Received")
    }
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
