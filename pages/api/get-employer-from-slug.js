import { prisma } from "../../prisma/generated"
import * as R from "ramda"

export default async (req, res) => {
  const slug = req._parsedUrl.query
  const eligibilityCriteria = await prisma
    .employer({ slug })
    .eligibilityCriteria()
  const employer = await prisma.employer({ slug })

  const response = R.pipe(
    R.merge,
    R.omit(["id", "updatedAt", "createdAt"])
  )(employer, eligibilityCriteria)

  res.setHeader("Content-Type", "application/json")
  res.statusCode = 200
  return res.json({ employer: response })
}
