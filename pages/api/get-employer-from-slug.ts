import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma/generated"
import * as R from "ramda"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query.slug as string
  const employer = await prisma.employer({ slug })

  const response = R.omit(["id", "updatedAt", "createdAt"])(employer)

  return res.status(200).json({ employer: response })
}
