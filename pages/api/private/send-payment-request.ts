import { NextApiRequest, NextApiResponse } from 'next'

import mango from '../../../lib/mango'

import { prisma } from '../../../prisma/generated/ts'

import {
  sendProviderPaymentNotification,
  sendEmployeeOutgoingPaymentNotification,
} from '../../../utils/mailgunClient'
import poundsToPennies from '../../../utils/poundsToPennies'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  // @ts-ignore
  const user = req.user
  const { childcareProviderId, amountToPay, reference } = req.body

  try {
    const childcareProvider = await prisma.childcareProvider({
      id: childcareProviderId,
    })

    await mango.Transfers.create({
      AuthorId: user.mangoUserId,
      DebitedFunds: {
        Currency: 'GBP',
        Amount: poundsToPennies(amountToPay),
      },
      Fees: {
        Currency: 'GBP',
        Amount: 0,
      },
      DebitedWalletId: user.mangoWalletId,
      CreditedWalletId: childcareProvider.mangoWalletId,
    })

    const bankAccount = await mango.Users.getBankAccount(
      childcareProvider.mangoLegalUserId,
      childcareProvider.mangoBankAccountId,
    )

    await mango.PayOuts.create({
      AuthorId: childcareProvider.mangoLegalUserId,
      DebitedFunds: {
        Currency: 'GBP',
        Amount: poundsToPennies(amountToPay),
      },
      Fees: {
        Currency: 'GBP',
        Amount: 0,
      },
      BankAccountId: bankAccount.Id,
      DebitedWalletId: childcareProvider.mangoWalletId,
      BankWireRef: reference,
      // @ts-ignore
      PaymentType: 'BANK_WIRE',
    })

    sendProviderPaymentNotification({
      email: childcareProvider.email,
      amountToPay: poundsToPennies(amountToPay),
      employeeName: `${user.firstName} ${user.lastName}`,
    })

    sendEmployeeOutgoingPaymentNotification({
      email: user.email,
      amountToPay: poundsToPennies(amountToPay),
    })

    res.status(200).end()
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error(err)
    res.status(400).end()
  }
}
