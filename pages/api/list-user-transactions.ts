import { NextApiRequest, NextApiResponse } from "next"
import R from "ramda"

import mango from "../../lib/mango"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const options = {
    parameters: {
      Per_Page: 100,
      Sort: "CreationDate:DESC",
    },
  }

  const transactions = await mango.Users.getTransactions(
    req.query.mangoId as string,
    // @ts-ignore
    options
  ).then(R.filter((transaction: any) => transaction.Status === "SUCCEEDED"))

  const transfers: any = R.filter(
    (transaction: any) => transaction.Type === "TRANSFER"
  )(transactions)

  // const payIns: any = R.filter(
  //   (transaction: any) => transaction.Type === "PAYIN"
  // )(transactions)

  const getPayees = R.pipe(
    R.map(R.prop("CreditedUserId")),
    // @ts-ignore
    R.uniq,
    // @ts-ignore
    R.map((id: string) => mango.Users.get(id))
  )

  const recentPayeesByMangoId = await Promise.all(getPayees(transfers)).then(
    R.reduce((acc, payee: any) => ({ ...acc, [payee.Id]: payee }), {})
  )

  res.json({ transactions, recentPayeesByMangoId })
}
