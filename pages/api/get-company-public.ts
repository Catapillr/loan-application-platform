import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { company_number } = req.query
    const { data } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}`,
      {
        auth: {
          username: process.env.COMPANIES_HOUSE_API,
          password: "",
        },
      }
    )

    const company = {
      businessName: data.company_name,
      companyNumber: data.company_number,
      AddressLine1: data.registered_office_address.address_line_1,
      AddressLine2: data.registered_office_address.address_line_2,
      City: data.registered_office_address.locality,
      Region: data.registered_office_address.locality,
      PostalCode: data.registered_office_address.postal_code,
      Country: "GB",
      companyCodes: data.sic_codes,
    }

    res.json({ company })
  } catch (e) {
    console.log("There was an error retrieving Companies House data: ", e) //eslint-disable-line no-console
  }
}
