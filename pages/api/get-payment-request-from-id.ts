import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../prisma/generated/ts"
import gql from "graphql-tag"

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
    mangoPaymentID
    amountToPay
    consentToPay
    reference
    expiresAt
  }
`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req.query.id as string

    const { childcareProvider, user, ...paymentRequest }: any = await prisma
      .paymentRequest({
        id,
      })
      .$fragment(hydratePaymentRequest)

    return res.status(200).json({
      childcareProvider,
      user,
      paymentRequest,
    })
  } catch (error) {
    console.error("Error in get-payment-request-from-id: ", error)
    return res.status(404).json({
      error,
    })
  }
}
