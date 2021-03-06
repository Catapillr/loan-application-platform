import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/generated/ts'
import gql from 'graphql-tag'

const hydratePaymentRequest = gql`
  fragment paymentRequestHydrated on PaymentRequest {
    user {
      firstName
      lastName
      email
    }
    childcareProvider {
      email
      companyNumber
      mangoLegalUserId
      approved
      expiresAt
    }
    amountToPay
    consentToPay
    reference
    expiresAt
  }
`

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  try {
    const { childcareProviderId } = req.query

    const [{ childcareProvider, user, ...paymentRequest }]: any = await prisma
      .paymentRequests({
        where: {
          childcareProvider: { id: childcareProviderId as string },
          // eslint-disable-next-line @typescript-eslint/camelcase
          expiresAt_gt: new Date().toISOString(),
        },
      })
      .$fragment(hydratePaymentRequest)

    return res.status(200).json({
      childcareProvider,
      employee: user,
      paymentRequest,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in get-provider-registration-info: ', error)
    return res.status(404).json({
      error,
    })
  }
}
