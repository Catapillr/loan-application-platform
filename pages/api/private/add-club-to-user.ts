import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../prisma/generated/ts'

import { REQUEST_FAILED, REQUEST_SUCCESSFUL } from '../../../utils/constants'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  try {
    // @ts-ignore
    const user = req.user

    const { companyNumber } = req.body

    await prisma.updateUser({
      data: {
        schoolHolidayClubs: { connect: { companyNumber } },
      },
      where: {
        email: user.email,
      },
    })

    return res.status(200).json({ response: REQUEST_SUCCESSFUL })
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error(
      'Error when adding club to user: ',
      JSON.stringify(err, undefined, 2),
    )

    return res.status(400).json({ response: REQUEST_FAILED })
  }
}
