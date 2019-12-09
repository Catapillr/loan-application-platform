import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import * as R from 'ramda'
// import { validSicCodes } from "../../utils/constants"

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
          password: '',
        },
      },
    )

    const companies = R.map(
      R.pickAll(['title', 'company_number', 'address_snippet']),
    )(items)
    res.status(200).json({ companies })

    // un-comment out all below for production with filter by SIC code applied and delete the response above

    // const getSicCodes = async company => {
    //   const { data: { sic_codes } } = await axios(
    //     `https://api.companieshouse.gov.uk/company/${company["company_number"]}`,
    //     {
    //       auth: {
    //         username: process.env.COMPANIES_HOUSE_API,
    //         password: "",
    //       },
    //     }
    //   )

    //   return R.assoc("sic_codes", sic_codes, company)
    // }

    // Promise
    //   .all(companies.map(company => getSicCodes(company)))
    //   .then(companiesWithCodes => {
    //     const includes = code => R.includes(code, validSicCodes)

    //     const companiesWithValidCodes = R.filter(({ sic_codes }) => sic_codes ? R.any(includes, sic_codes) : false, companiesWithCodes)

    //     return res.status(200).json({ companies: companiesWithValidCodes })

    //   })
    //   .catch(e => console.log("error getting company SIC codes", e));
  } catch (e) {
    console.log('There was an error in /get-companies endpoint: ', e) //eslint-disable-line no-console
  }
}
