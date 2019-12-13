import { NextApiRequest, NextApiResponse } from 'next'
import gql from 'graphql-tag'
import { prisma } from '../../prisma/generated/ts'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const slug = req.query.slug as string

  const employer = await prisma.employer({ slug }).$fragment(gql`
    fragment EmployerWithEmails on Employer {
      name
      slug
      address
      companyNumber
      emailSuffixes {
        domain
      }
      maximumAmount
      minimumServiceLength
      maxSalaryPercentage
      payrollEmail
      signerEmail
    }
  `)

  return res.status(200).json({ employer })
}
