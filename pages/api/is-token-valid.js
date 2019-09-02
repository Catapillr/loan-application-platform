import { prisma } from "../../prisma/generated"
import * as moment from "moment"
import * as R from "ramda"

export default async (req, res) => {
  const response = await prisma.verificationToken({
    email: req.query.email,
  })

  const isTokenValid =
    R.eqProps("token", req.query, response) &&
    R.eqProps("email", req.query, response) &&
    moment().isBefore(response.expiresAt)

  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  return res.json({ isTokenValid })
}
