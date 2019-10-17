import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import fs from "fs"
import { file } from "tmp-promise"
import * as R from "ramda"

import countryToISO from "../../utils/countryToISO"
import nationalityToISO from "../../utils/nationalityToISO"
import getLastPath from "../../utils/getLastPath"
import moment from "moment"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authentication = {
      auth: {
        username: process.env.COMPANIES_HOUSE_API,
        password: "",
      },
    }
    // const { company_number } = req.query
    // const company_number = "10971761"
    const company_number = "11912270"

    const { data: company_data } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}`,
      authentication
    )
    const {
      data: { items: ubo_data },
    } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}/persons-with-significant-control`,
      authentication
    )

    const {
      data: { items: filing_data },
    } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}/filing-history?category=incorporation`,
      authentication
    )

    const transaction_id = R.pipe(
      R.filter((file: any) => file.category === "incorporation"),
      R.head,
      file => getLastPath(file.links.document_metadata)
    )(filing_data)

    const { data, ...articles } = await axios(
      `https://document-api.companieshouse.gov.uk/document/${transaction_id}/content`,
      { headers: { Accept: "application/pdf" }, ...authentication }
    )

    const { data: incorporationDocument } = await axios.get(
      articles.request.res.responseUrl,
      {
        responseType: "stream",
      }
    )

    const { fd, path, cleanup } = await file({ postfix: ".pdf" })
    console.log("path", path)
    incorporationDocument.pipe(fs.createWriteStream(path))

    const ubos = R.addIndex(R.reduce)((acc: any, ubo: any, index: number) => {
      return {
        ...acc,
        [`ubo${index + 1}`]: {
          FirstName: ubo.name_elements.forename,
          LastName: ubo.name_elements.surname,
          Address: {
            AddressLine1: ubo.address.address_line_1,
            AddressLine2: ubo.address.address_line_2,
            City: ubo.address.locality,
            Region: ubo.address.locality,
            PostalCode: ubo.address.postal_code,
            Country: countryToISO(ubo.address.country),
          },
          Nationality: nationalityToISO(ubo.nationality),
          Birthplace: {
            City: "",
            Country: "",
          },
          Birthday: {
            year: ubo.date_of_birth.year,
            month: ubo.date_of_birth.month,
            day: "",
          },
        },
      }
    }, {})(ubo_data)

    const company = {
      businessName: company_data.company_name,
      companyNumber: company_data.company_number,
      AddressLine1: company_data.registered_office_address.address_line_1,
      AddressLine2: company_data.registered_office_address.address_line_2,
      City: company_data.registered_office_address.locality,
      Region: company_data.registered_office_address.locality,
      PostalCode: company_data.registered_office_address.postal_code,
      Country: countryToISO(company_data.registered_office_address.country),
      companyCodes: company_data.sic_codes,
      articlesOfAssociation: {
        name: "CH_incorporation.pdf",
        type: "application/pdf",
        size: 300000,
        fileOnServer: true,
        path,
        webkitRelativePath: path,
      },
      ...ubos,
    }

    res.json({ company })
  } catch (e) {
    console.log("There was an error retrieving Companies House data: ", e) //eslint-disable-line no-console
  }
}

// const initialValues = {
//   businessName: "",
//   businessEmail: "",
//   companyNumber: "",
//   repFirstName: "",
//   repLastName: "",
//   repKeyContact: "",
//   repDob: { day: "", month: "", year: "" },
//   repCountryOfResidence: "",
//   repNationality: "",
//   proofOfId: {
//     name: "",
//     lastModified: "",
//     lastModifiedDate: "",
//     webkitRelativePath: "",
//   },
//   articlesOfAssociation: {
//     name: "",
//     lastModified: "",
//     lastModifiedDate: "",
//     webkitRelativePath: "",
//   },
//   proofOfRegistration: {
//     name: "",
//     lastModified: "",
//     lastModifiedDate: "",
//     webkitRelativePath: "",
//   },
//   bankName: "",
//   accountNumber: "",
//   sortCode: {
//     firstSection: "",
//     secondSection: "",
//     thirdSection: "",
//   },
//   AddressLine1: "",
//   AddressLine2: "",
//   City: "",
//   Region: "",
//   PostalCode: "",
//   Country: "",
// }
