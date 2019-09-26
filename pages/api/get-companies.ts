import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import * as R from "ramda"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { q, items_per_page = 6 } = req.query
    const {
      data: { items },
    } = await axios(
      `https://api.companieshouse.gov.uk/search/companies?q=${q}&items_per_page=${items_per_page}`,
      {
        auth: {
          username: process.env.COMPANIES_HOUSE_API,
          password: "",
        },
      }
    )

    const companies = R.map(
      R.pickAll(["title", "company_number", "address_snippet"])
    )(items)
    res.status(200).json({ companies })
  } catch (e) {
    console.log("There was an error retrieving Companies House data: ", e) //eslint-disable-line no-console
  }
}
