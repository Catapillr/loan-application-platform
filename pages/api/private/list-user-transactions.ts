import { NextApiRequest, NextApiResponse } from 'next'
import R from 'ramda'

import mango from '../../../lib/mango'
import { prisma } from '../../../prisma/generated/ts'
import gql from 'graphql-tag'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const options = {
    parameters: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      Per_Page: 100,
      Sort: 'CreationDate:DESC',
    },
  }

  const transactions = await mango.Users.getTransactions(
    req.query.mangoId as string,
    // @ts-ignore
    options,
  ).then(
    R.pipe(
      R.filter((transaction: any) => transaction.Status === 'SUCCEEDED'),
      R.map(async (transaction: any) => {
        if (transaction.Type === 'PAYIN') {
          const catapillrPayIn: any = await prisma.payIn({
            mangoPayInId: transaction.Id,
          }).$fragment(gql`
            fragment payInWithEmployer on PayIn {
              employer {
                name
              }
            }
          `)

          return {
            ...transaction,
            debitedUserName: catapillrPayIn.employer.name,
          }
        }
        return transaction
      }),
      (transactions: any) => Promise.all(transactions),
    ),
  )

  const transfers: any = R.filter(
    (transaction: any) => transaction.Type === 'TRANSFER',
  )(transactions)

  const payees = await Promise.all(
    R.pipe(
      R.map(R.prop('CreditedUserId')),
      // @ts-ignore
      R.uniq,
      // @ts-ignore
      R.map((id: string) => mango.Users.get(id)),
    )(transfers),
  )

  const recentPayeesByMangoId = R.reduce(
    (acc, payee: any) => ({ ...acc, [payee.Id]: payee }),
    {},
  )(payees)

  res.json({ transactions, recentPayeesByMangoId })
}
