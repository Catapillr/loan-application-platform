import axios from 'axios'
import gql from 'graphql-tag'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import R from 'ramda'

import mango from '../../lib/mango'
import { prisma } from '../../prisma/generated/ts'
import {
  sendEmployeeLoanPaymentNotification,
  sendEmployerPaymentNotification,
  sendIncorrectPaymentNotification,
  sendKYCorUBOFailure,
  sendProviderPaymentNotification,
  sendEmployeeOutgoingPaymentNotification,
} from '../../utils/mailgunClient'

const PAYIN_SUCCEEDED = 'PAYIN_NORMAL_SUCCEEDED'
const KYC_SUCCEEDED = 'KYC_SUCCEEDED'
const KYC_FAILED = 'KYC_FAILED'

const UBO_DECLARATION_REFUSED = 'UBO_DECLARATION_REFUSED'
const UBO_DECLARATION_VALIDATED = 'UBO_DECLARATION_VALIDATED'
const UBO_DECLARATION_INCOMPLETE = 'UBO_DECLARATION_INCOMPLETE'

// KYC_CREATED, KYC_SUCCEEDED, KYC_FAILED, KYC_VALIDATION_ASKED
// UBO_DECLARATION_CREATED, UBO_DECLARATION_VALIDATION_ASKED, UBO_DECLARATION_REFUSED, UBO_DECLARATION_VALIDATED, UBO_DECLARATION_INCOMPLETE

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  try {
    const { EventType, RessourceId } = req.query

    const handleEvents: any = ((): any => {
      switch (EventType) {
        case PAYIN_SUCCEEDED:
          return handleSuccesfulPayIn
        case KYC_SUCCEEDED:
          return handleKYC
        case KYC_FAILED:
          return handleKYC
        case UBO_DECLARATION_VALIDATED:
          return handleUBO
        case UBO_DECLARATION_REFUSED:
          return handleUBO
        case UBO_DECLARATION_INCOMPLETE:
          return handleUBO
        default:
          return () => (): any => res.status(200).end()
      }
    })()

    handleEvents(res)({ RessourceId, EventType })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Mango listen hook error: ', err)
  }
}

const handleUBO = (res: NextApiResponse) => async ({
  RessourceId,
  EventType,
}): Promise<any> => {
  try {
    const { data: resource } = await axios.get(
      `${process.env.MANGO_URL}/v2.01/${process.env.MANGO_CLIENT_ID}/kyc/ubodeclarations/${RessourceId}`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${process.env.MANGO_CLIENT_ID}:${process.env.MANGO_KEY}`,
          ).toString('base64')}`,
        },
      },
    )

    if (
      EventType === UBO_DECLARATION_REFUSED ||
      EventType === UBO_DECLARATION_INCOMPLETE
    ) {
      sendKYCorUBOFailure(resource)
      return res.status(200).end()
    }

    const mangoLegalUser = await mango.Users.get(resource.UserId)

    if (mangoLegalUser.KYCLevel === 'REGULAR') {
      await processPaymentRequest(mangoLegalUser.Id)
    }

    res.status(200).end()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error with UBO hook: ', err)
  }
}

const handleKYC = (res: NextApiResponse) => async ({
  RessourceId,
  EventType,
}): Promise<any> => {
  try {
    const resource = await mango.KycDocuments.get(RessourceId)
    if (EventType === KYC_FAILED) {
      sendKYCorUBOFailure(resource)
      return res.status(200).end()
    }

    const mangoLegalUser = await mango.Users.get(resource.UserId)

    if (mangoLegalUser.KYCLevel === 'REGULAR') {
      await processPaymentRequest(mangoLegalUser.Id)
    }

    res.status(200).end()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error with KYC hook: ', err)
  }
}

const processPaymentRequest = async (
  mangoLegalUserId: string,
): Promise<any> => {
  const provider = await prisma.childcareProvider({
    mangoLegalUserId,
  })

  const paymentRequests: any = await prisma
    .childcareProvider({ mangoLegalUserId })
    .paymentRequests({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        expiresAt_gt: new Date().toISOString(),
      },
    }).$fragment(gql`
    fragment paymentRequestWithUser on PaymentRequest {
      id
      amountToPay
      reference
      user {
        mangoUserId
        mangoWalletId
        firstName
        lastName
        email
      }
    }
  `)

  const processPayout = async (paymentRequest: any): Promise<any> => {
    await mango.Transfers.create({
      AuthorId: paymentRequest.user.mangoUserId,
      DebitedFunds: {
        Currency: 'GBP',
        Amount: paymentRequest.amountToPay,
      },
      Fees: {
        Currency: 'GBP',
        Amount: 0,
      },
      DebitedWalletId: paymentRequest.user.mangoWalletId,
      CreditedWalletId: provider.mangoWalletId,
    })

    await mango.PayOuts.create({
      AuthorId: provider.mangoLegalUserId,
      DebitedFunds: {
        Currency: 'GBP',
        Amount: paymentRequest.amountToPay,
      },
      Fees: {
        Currency: 'GBP',
        Amount: 0,
      },
      BankAccountId: provider.mangoBankAccountId,
      DebitedWalletId: provider.mangoWalletId,
      BankWireRef: paymentRequest.reference,
      // @ts-ignore
      PaymentType: 'BANK_WIRE',
    })

    await prisma.deletePaymentRequest({ id: paymentRequest.id })

    await sendProviderPaymentNotification({
      email: provider.email,
      amountToPay: paymentRequest.amountToPay,
      employeeName: `${paymentRequest.user.firstName} ${paymentRequest.user.lastName}`,
    })

    await sendEmployeeOutgoingPaymentNotification({
      email: paymentRequest.user.email,
      amountToPay: paymentRequest.amountToPay,
    })
  }

  return await Promise.all(R.map(processPayout)(paymentRequests))
}

const handleSuccesfulPayIn = (res: NextApiResponse) => async ({
  RessourceId,
}): Promise<any> => {
  try {
    const {
      DebitedFunds,
      CreditedWalletId,
      ExecutionDate,
    } = await mango.PayIns.get(RessourceId as string)

    const user = await prisma.user({
      mangoWalletId: CreditedWalletId as string,
    })

    const loan = await prisma
      .user({ mangoWalletId: CreditedWalletId as string })
      .loan()

    const employer = await prisma
      .user({ mangoWalletId: CreditedWalletId as string })
      .employer()

    const payment = {
      loanAmount: loan.amount,
      payInAmount: DebitedFunds.Amount,
      payInId: RessourceId,
      dateOfPayment: moment
        .utc(ExecutionDate)
        .format('Do MMMM YYYY, h:mm:ss a'),
      discrepancy: DebitedFunds.Amount - loan.amount,
    }

    const isPayInEqualToLoan =
      loan.amount + loan.platformFees === DebitedFunds.Amount

    if (!isPayInEqualToLoan) {
      sendIncorrectPaymentNotification({
        payment,
        user,
        employer,
      })

      return res.status(200).send(`PAYIN unequal to loan amount`)
    }

    if (isPayInEqualToLoan) {
      sendEmployerPaymentNotification({
        payment,
        user,
        employer,
      })

      sendEmployeeLoanPaymentNotification({
        payment,
        user,
      })
      return res.status(200).send(`Loan sucessfully paid by employer`)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Payin listen didn't work: ", err)
  }
}
