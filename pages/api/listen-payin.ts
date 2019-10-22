import axios from "axios"
import gql from "graphql-tag"
import moment from "moment"
import { NextApiRequest, NextApiResponse } from "next"
import R from "ramda"

import mango from "../../lib/mango"
import { prisma } from "../../prisma/generated/ts"
import {
  sendEmployeeLoanPaymentNotification,
  sendEmployerPaymentNotification,
  sendIncorrectPaymentNotification,
  sendKYCorUBOFailure,
} from "../../utils/mailgunClient"

const PAYIN_SUCCEEDED = "PAYIN_NORMAL_SUCCEEDED"
const KYC_SUCCEEDED = "KYC_SUCCEEDED"
const KYC_FAILED = "KYC_FAILED"

const UBO_DECLARATION_REFUSED = "UBO_DECLARATION_REFUSED"
const UBO_DECLARATION_VALIDATED = "UBO_DECLARATION_VALIDATED"
const UBO_DECLARATION_INCOMPLETE = "UBO_DECLARATION_INCOMPLETE"

// KYC_CREATED, KYC_SUCCEEDED, KYC_FAILED, KYC_VALIDATION_ASKED
// UBO_DECLARATION_CREATED, UBO_DECLARATION_VALIDATION_ASKED, UBO_DECLARATION_REFUSED, UBO_DECLARATION_VALIDATED, UBO_DECLARATION_INCOMPLETE

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { EventType, RessourceId } = req.query
    console.log("woooooooooooooo", req.query)

    const handleEvents: any = (() => {
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
          return res.status(200).end()
      }
    })()

    handleEvents(res)({ RessourceId, EventType })
  } catch (err) {
    console.error("Mango listen hook error: ", err)
  }
}

const handleUBO = (res: NextApiResponse) => async ({
  RessourceId,
  EventType,
}) => {
  try {
    const { data: resource } = await axios.get(
      `https://api.sandbox.mangopay.com/v2.01/${process.env.MANGO_CLIENT_ID}/kyc/ubodeclarations/${RessourceId}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.MANGO_CLIENT_ID}:${process.env.MANGO_KEY}`
          ).toString("base64")}`,
        },
      }
    )

    if (
      EventType === UBO_DECLARATION_REFUSED ||
      EventType === UBO_DECLARATION_INCOMPLETE
    ) {
      sendKYCorUBOFailure(resource)
      return res.status(200).end()
    }

    const mangoLegalUser = await mango.Users.get(resource.UserId)

    if (mangoLegalUser.KYCLevel === "REGULAR") {
      await processPaymentRequest(mangoLegalUser.Id)
      // return res.status(200).end()
    }

    res.status(200).end()
  } catch (err) {
    console.error("Error with UBO hook: ", err)
    // TODO: take out
    res.status(200).end()
  }
}

const handleKYC = (res: NextApiResponse) => async ({
  RessourceId,
  EventType,
}) => {
  try {
    const resource = await mango.KycDocuments.get(RessourceId)
    if (EventType === KYC_FAILED) {
      sendKYCorUBOFailure(resource)
      return res.status(200).end()
    }

    const mangoLegalUser = await mango.Users.get(resource.UserId)

    if (mangoLegalUser.KYCLevel === "REGULAR") {
      await processPaymentRequest(mangoLegalUser.Id)
      // return res.status(200).end()
    }

    res.status(200).end()
  } catch (err) {
    console.error("Error with KYC hook: ", err)
  }
}

const processPaymentRequest = async (mangoLegalUserID: string) => {
  const provider = await prisma.childcareProvider({
    mangoLegalUserID,
  })

  const paymentRequests: any = await prisma
    .childcareProvider({
      companyNumber: provider.companyNumber,
    })
    .paymentRequests({ where: { expiresAt_gt: new Date().toISOString() } })
    .$fragment(gql`
    fragment paymentRequestWithUser on PaymentRequest {
      id
      amountToPay
      reference
      user {
        mangoUserId
        mangoWalletId
      }
    }
  `)

  const processPayout = async (paymentRequest: any) => {
    await mango.Transfers.create({
      AuthorId: paymentRequest.user.mangoUserId,
      DebitedFunds: {
        Currency: "GBP",
        Amount: paymentRequest.amountToPay,
      },
      Fees: {
        Currency: "GBP",
        Amount: 0,
      },
      DebitedWalletId: paymentRequest.user.mangoWalletId,
      CreditedWalletId: provider.mangoWalletId,
    })

    await mango.PayOuts.create({
      AuthorId: provider.mangoLegalUserID,
      DebitedFunds: {
        Currency: "GBP",
        Amount: paymentRequest.amountToPay,
      },
      Fees: {
        Currency: "GBP",
        Amount: 0,
      },
      BankAccountId: provider.mangoBankAccountID,
      DebitedWalletId: provider.mangoWalletId,
      BankWireRef: paymentRequest.reference,
      // @ts-ignore
      PaymentType: "BANK_WIRE",
    })

    await prisma.deletePaymentRequest({ id: paymentRequest.id })
    // TODO: send out emails saying payment succesful
  }

  return await Promise.all(R.map(processPayout)(paymentRequests))
}

const handleSuccesfulPayIn = (res: NextApiResponse) => async ({
  RessourceId,
}) => {
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
      dateOfPayment: moment(ExecutionDate).format("Do MMMM YYYY, h:mm:ss a"),
      discrepancy: DebitedFunds.Amount - loan.amount,
    }

    const isPayInEqualToLoan = loan.amount === DebitedFunds.Amount

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
    console.error("Payin listen didn't work: ", err)
  }
}
