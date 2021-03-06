import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import * as R from 'ramda'

import { prisma } from '../../prisma/generated/ts'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const response = await prisma.verificationToken({
    email: req.query.email as string,
  })

  const isTokenValid =
    R.eqProps('token', req.query, response) &&
    R.eqProps('email', req.query, response) &&
    moment().isBefore(response.expiresAt)

  return res.status(200).json({ isTokenValid })
}
