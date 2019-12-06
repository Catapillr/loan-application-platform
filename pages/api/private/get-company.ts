import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

import { prisma } from "../../../prisma/generated/ts"

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  try {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { company_number } = req.query

    const { data: company } = await axios(
      // eslint-disable-next-line @typescript-eslint/camelcase
      `https://api.companieshouse.gov.uk/company/${company_number}`,
      {
        auth: {
          username: process.env.COMPANIES_HOUSE_API,
          password: "",
        },
      }
    )

    const catapillrChildcareProvider = await prisma.childcareProvider({
      // eslint-disable-next-line @typescript-eslint/camelcase
      companyNumber: company_number as string,
    })

    res.json({ company, catapillrChildcareProvider })
  } catch (e) {
    res.status(404)
    res.end()
    console.log("There was an error in /get-company endpoint:", e) //eslint-disable-line no-console
  }
}
