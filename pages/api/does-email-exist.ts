import { NextApiRequest, NextApiResponse } from "next"

import { prisma } from "../../prisma/generated/ts"
import { USER, CHILDCAREPROVIDER } from "../../utils/constants"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const accountTypeExists = (params: any) => {
    switch (req.query.accountType as string) {
      case USER:
        return prisma.$exists.user(params)
      case CHILDCAREPROVIDER:
        return prisma.$exists.childcareProvider(params)
    }
  }

  const doesEmailExist = await accountTypeExists({
    email: req.query.email as string,
  })

  return res.status(200).json({ doesEmailExist })
}
