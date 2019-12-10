import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../prisma/generated/ts'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  try {
    // @ts-ignore
    const user = req.user

    const { name, taxFreeChildReference } = req.body

    await prisma.createChildAccount({
      name,
      taxFreeChildReference,
      parent: {
        connect: {
          email: user.email,
        },
      },
    })

    res.status(200).end()
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error(
      'Error when adding child tax free details on server: ',
      JSON.stringify(err, undefined, 2),
    )

    if (
      err.message.includes('unique') &&
      err.message.includes('taxFreeChildReference')
    ) {
      res.status(400).json({ unique: false, field: 'taxFreeChildReference' })
    }
  }
}
