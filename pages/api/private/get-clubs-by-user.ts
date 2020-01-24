import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../prisma/generated/ts'
import gql from 'graphql-tag'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  try {
    // @ts-ignore
    const user = req.user

    const { schoolHolidayClubs: clubsByUser } = await prisma.user({
      email: user.email,
    }).$fragment(gql`
      fragment ClubsByUser on User {
        schoolHolidayClubs {
          companyName
          companyNumber
          websiteURL
          imgURL
        }
      }
    `)

    res.status(200)
    return res.json({ clubsByUser })
  } catch (e) {
    console.log('There was an error in /get-clubs-by-location endpoint: ', e) //eslint-disable-line no-console
  }
}
