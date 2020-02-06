import { NextApiRequest, NextApiResponse } from 'next'
import * as R from 'ramda'
import { prisma } from '../../../prisma/generated/ts'
import gql from 'graphql-tag'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  try {
    // @ts-ignore
    const user = req.user

    const clubsArray = await prisma.locations({
      orderBy: 'location_ASC',
    }).$fragment(gql`
      fragment ClubsByLocation on Location {
        name: location
        schoolHolidayClubs {
          companyName
          companyNumber
          websiteURL
          imgURL
          addedByUser: users(where: { email: "${user.email}" }) {
            email
          }
        }
      }
    `)

    const clubsByLocation = R.pipe(
      R.partition(R.propEq('name', 'Nationwide')),
      arrs => R.concat(...arrs),
      R.reduce((acc, { name, schoolHolidayClubs }) => {
        return { ...acc, [name]: schoolHolidayClubs }
      }, {}),
    )(clubsArray)

    res.status(200)
    return res.json({ clubsByLocation })
  } catch (e) {
    console.log('There was an error in /get-clubs-by-location endpoint: ', e) //eslint-disable-line no-console
  }
}
