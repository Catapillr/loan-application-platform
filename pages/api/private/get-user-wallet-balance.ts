import { NextApiRequest, NextApiResponse } from "next"

import mango from "../../../lib/mango"

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  try {
    // @ts-ignore
    const user = req.user

    const wallet = await mango.Wallets.get(user.mangoWalletId)
    res.json({ userWalletBalance: wallet.Balance.Amount })
  } catch (e) {
    console.log("There was an error retrieving wallet balance: ", e) //eslint-disable-line no-console
  }
}
