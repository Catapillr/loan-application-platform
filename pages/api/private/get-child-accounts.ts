import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../../prisma/generated/ts/index"
import gql from "graphql-tag"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // @ts-ignore
    const user = req.user

    const childAccounts = await prisma.user({ email: user.email })
      .$fragment(gql`
      fragment UserWithChildren on User {
        childAccounts {
          name
          taxFreeChildReference
        }
      }
    `)

    res.json(childAccounts)
  } catch (e) {
    console.log("There was an error retrieving wallet balance: ", e) //eslint-disable-line no-console
  }
}
