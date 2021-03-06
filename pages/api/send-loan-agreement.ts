import hellosign from 'hellosign-sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import moment from 'moment'
import R_ from '../../utils/R_'

import zeroIndexMonth from '../../utils/zeroIndexMonth'
import poundsToPennies from '../../utils/poundsToPennies'
import { formatToGBP, unformatFromGBP } from '../../utils/currencyFormatter'

import { prisma } from '../../prisma/generated/ts'
import calculatePlatformFees from '../../utils/calculatePlatformFees'

const helloSignClient = hellosign({
  key: process.env.HELLOSIGN_KEY,
})

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const {
    employmentStartDate,
    email,
    annualSalary,
    loanAmount,
    loanTerms,
    firstName,
    lastName,
    dob,
    nationality,
    employeeId,
    phoneNumber,
    employer: { slug },
    gdprConsent,
  } = req.body

  const employer = await prisma.employer({ slug })

  const platformFees = calculatePlatformFees({
    minimumLoanFee: employer.minimumLoanFee,
    loanAmount: poundsToPennies(loanAmount),
  })

  await prisma
    .createUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      dob: moment.utc(zeroIndexMonth(dob)).toDate(),
      nationality,
      employmentStartDate: moment
        .utc(zeroIndexMonth(employmentStartDate))
        .toDate(),
      employeeId,
      annualSalary: poundsToPennies(annualSalary),
      employer: { connect: { slug: employer.slug } },
      loan: {
        create: {
          amount: poundsToPennies(loanAmount),
          terms: parseInt(loanTerms),
          platformFees,
        },
      },
      gdprConsent,
    })
    .catch(e => {
      console.error('Error creating prisma user: ', e) //eslint-disable-line no-console
    })

  const loanOptions = (
    loanAmount: number,
    loanTerms: number,
    maximumTerms = 11,
  ): { name: string; value: any }[] => {
    const monthlyRepayment = Math.floor(loanAmount / loanTerms)
    const remainder = loanAmount % loanTerms
    const firstMonth = monthlyRepayment + remainder

    const loanDetails = [
      {
        name: 'loanAmount',
        value: unformatFromGBP(loanAmount),
      },
      {
        name: 'loanTerms',
        value: loanTerms,
      },
      {
        name: 'loanMonthlyRepayment',
        value: unformatFromGBP(monthlyRepayment),
      },
    ]

    // @ts-ignore
    const loanMonths = R_.mapIndexed((_: any, index: any) => ({
      name: `loanMonth${index + 1}`,
      value: `${
        index === 0
          ? `${formatToGBP(firstMonth)}`
          : `${formatToGBP(monthlyRepayment)}`
      }`,
    }))([...Array(loanTerms)])

    // @ts-ignore
    const defaultMonths = R_.mapIndexed((_: any, index: any) => ({
      name: `loanMonth${loanTerms + index + 1}`,
      value: 'n/a',
    }))([...Array(maximumTerms - loanTerms)])

    // @ts-ignore
    return [...loanDetails, ...loanMonths, ...defaultMonths]
  }

  const opts = {
    // eslint-disable-next-line @typescript-eslint/camelcase
    test_mode: 1 as hellosign.Flag,
    // eslint-disable-next-line @typescript-eslint/camelcase
    template_id: 'f7d22e065f90856421dc4d0f4b0257783a22c356',
    title: 'Employee CCAS loan agreement',
    subject: 'Employee CCAS loan agreement',
    signers: [
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        email_address: email,
        name: `${firstName} ${lastName} `,
        role: 'Employee',
      },
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        email_address: employer.signerEmail,
        name: employer.name,
        role: 'Employer',
      },
    ],
    // eslint-disable-next-line @typescript-eslint/camelcase
    custom_fields: [
      {
        name: 'employerName',
        value: employer.name,
      },
      {
        name: 'employerCompanyNumber',
        value: employer.companyNumber || 'n/a',
      },
      {
        name: 'employerAddress',
        value: employer.address,
      },
      {
        name: 'employerMinimumService',
        value: employer.minimumServiceLength,
      },
      {
        name: 'userName',
        value: `${firstName} ${lastName} `,
      },
      {
        name: 'userEmployeeID',
        value: `${employeeId && employeeId !== '' ? employeeId : 'n/a'} `,
      },
      ...loanOptions(parseInt(loanAmount), parseInt(loanTerms)),
    ],
  }

  helloSignClient.signatureRequest.sendWithTemplate(opts).catch(e => {
    console.error('Sending loan agreement Hellosign error: ', e) //eslint-disable-line no-console
  })

  res.status(200).end()
}
