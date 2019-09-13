import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import * as R from "ramda"

import { prisma } from "../../prisma/generated"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const doesEmailExist = await prisma.$exists.verificationToken({
    email: req.query.email as string,
  })

  return res.status(200).json({ doesEmailExist })
}
