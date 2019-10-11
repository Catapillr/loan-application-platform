import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma/generated/ts"
import moment from "moment"

import mango from "../../lib/mango"

import {
  sendIncorrectPaymentNotification,
  sendEmployerPaymentNotification,
  sendEmployeePaymentNotification,
} from "../../utils/mailgunClient"

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

      return res.status(200).send(`PAYIN unequal to loan amount`)
    }

    if (isPayInEqualToLoan) {
      await sendEmployerPaymentNotification({
        payment,
        user,
        employer,
      })

      await sendEmployeePaymentNotification({
        payment,
        user,
      })
      return res.status(200).send(`Loan sucessfully paid by employer`)
    }
  } catch (err) {
    console.error("Payin listen didn't work: ", err)
  }
}
