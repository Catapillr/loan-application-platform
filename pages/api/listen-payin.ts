import { NextApiRequest, NextApiResponse } from "next"
import mangopay from "mangopay2-nodejs-sdk"
import { prisma } from "../../prisma/generated"
import moment from "moment"

import { sendIncorrectPaymentNotification } from "../../utils/mailgunClient"

const mango = new mangopay({
  clientId: process.env.MANGO_CLIENT_ID,
  clientApiKey: process.env.MANGO_KEY,
  // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
  // baseUrl: "https://api.mangopay.com",
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { EventType, RessourceId } = req.query

    const {
      DebitedFunds,
      CreditedWalletId,
      ExecutionDate,
    } = await mango.PayIns.get(RessourceId as string)

    const user = await prisma.user({
      mangoWalletId: CreditedWalletId as string,
    })

    const loan = await prisma
      .user({ mangoWalletId: CreditedWalletId as string })
      .loan()

    const employer = await prisma
      .user({ mangoWalletId: CreditedWalletId as string })
      .employer()

    const payment = {
      loanAmount: loan.amount,
      payInAmount: DebitedFunds.Amount,
      payInId: RessourceId,
      dateOfPayment: moment(ExecutionDate).format("Do MMMM YYYY, h:mm:ss a"),
      discrepancy: DebitedFunds.Amount - loan.amount,
    }

    const isPayInEqualToLoan = loan.amount === DebitedFunds.Amount

    if (!isPayInEqualToLoan) {
      await sendIncorrectPaymentNotification({
        payment,
        user,
        employer,
      })
    }

    return res.status(200).send(`${EventType}: ${RessourceId}`)
  } catch (err) {
    console.error("Payin listen didn't work: ", err)
  }
}
