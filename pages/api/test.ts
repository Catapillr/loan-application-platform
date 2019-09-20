import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma/generated/ts"

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const allEmployers = await prisma.employers()

  res.status(200).json({ allEmployers })
}
