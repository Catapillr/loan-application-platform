import { NextApiRequest, NextApiResponse } from "next"

import mango from "../../../lib/mango"
import poundsToPennies from "../../../utils/poundsToPennies"
import { sendEmployeeOutgoingPaymentNotification } from "../../../utils/mailgunClient"

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  try {
    // @ts-ignore
    const user = req.user

    const { reference, amountToPay } = req.body

    const { Status, ResultMessage } = await mango.Transfers.create({
      AuthorId: user.mangoUserId,
      DebitedFunds: {
        Currency: "GBP",
        Amount: poundsToPennies(amountToPay),
      },
      Fees: {
        Currency: "GBP",
        Amount: 0,
      },
      DebitedWalletId: user.mangoWalletId,
      CreditedWalletId: process.env.TAX_FREE_WALLET_ID,
    })

    const FAILED = "FAILED"
    const INSUFFICIENT_BALANCE = "Unsufficient wallet balance"

    if (Status === FAILED && ResultMessage === INSUFFICIENT_BALANCE) {
      return res
        .status(400)
        .json({ status: FAILED, reason: INSUFFICIENT_BALANCE })
    }

    await mango.PayOuts.create({
      AuthorId: process.env.TAX_FREE_ACCOUNT_USER_ID,
      DebitedFunds: {
        Currency: "GBP",
        Amount: poundsToPennies(amountToPay),
      },
      Fees: {
        Currency: "GBP",
        Amount: 0,
      },
      BankAccountId: process.env.TAX_FREE_BANK_ACCOUNT_ID,
      DebitedWalletId: process.env.TAX_FREE_WALLET_ID,
      BankWireRef: reference,
      // @ts-ignore
      PaymentType: "BANK_WIRE",
    })

    await sendEmployeeOutgoingPaymentNotification({
      email: user.email,
      amountToPay: poundsToPennies(amountToPay),
    })

    res.status(200).end()
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error(
      "Error when paying out to tax free account server: ",
      JSON.stringify(err, undefined, 2)
    )
  }
}
