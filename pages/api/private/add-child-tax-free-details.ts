import { NextApiRequest, NextApiResponse } from "next"

import { prisma } from "../../../prisma/generated/ts"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // @ts-ignore
    const user = req.user

    const { childName, childReferenceNumber } = req.body

    await prisma.createChild({
      name: childName,
      taxFreeChildReference: childReferenceNumber,
      parent: {
        connect: {
          email: user.email,
        },
      },
    })

    res.status(200).end()
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error("Error when adding child tax free details on server: ", err)
  }
}
