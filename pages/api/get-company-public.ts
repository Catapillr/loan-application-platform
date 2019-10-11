import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { company_number } = req.query
    const { data: company } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}`,
      {
        auth: {
          username: process.env.COMPANIES_HOUSE_API,
          password: "",
        },
      }
    )

    res.json({ company })
  } catch (e) {
    console.log("There was an error retrieving Companies House data: ", e) //eslint-disable-line no-console
  }
}
