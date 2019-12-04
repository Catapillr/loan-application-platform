import { NextApiRequest, NextApiResponse } from "next"

// import { prisma } from "../../../prisma/generated/ts"
import mango from "../../../lib/mango"
import poundsToPennies from "../../../utils/poundsToPennies"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async (req: NextApiRequest, res: NextApiResponse) => {
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

    // TODO: verify there are funds in account before sending payment
    // TODO: add notification emails
    // await sendProviderPaymentNotification({
    //   email: provider.email,
    //   amountToPay: paymentRequest.amountToPay,
    //   employeeName: `${paymentRequest.user.firstName} ${paymentRequest.user.lastName}`,
    // })
    //
    // await sendEmployeeOutgoingPaymentNotification({
    //   email: paymentRequest.user.email,
    //   amountToPay: paymentRequest.amountToPay,
    // })

    res.status(200).end()
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error(
      "Error when paying out to tax free account server: ",
      JSON.stringify(err, undefined, 2)
    )
  }
}
