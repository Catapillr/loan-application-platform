import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import fs from "fs"
import { file } from "tmp-promise"
import * as R from "ramda"
import R_ from "../../utils/R_"

import countryToISO from "../../utils/countryToISO"
import nationalityToISO from "../../utils/nationalityToISO"
import getLastPath from "../../utils/getLastPath"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authentication = {
      auth: {
        username: process.env.COMPANIES_HOUSE_API,
        password: "",
      },
    }
    const { company_number } = req.query

    const { data: company_data } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}`,
      authentication
    )

    const {
      data: { items: ubo_data },
    } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}/persons-with-significant-control`,
      authentication
    ).catch(e => {
      const [{ error }] = e.response.data.errors
      if (error === "company-psc-not-found") {
        return { data: { items: [] } }
      }
      console.log("Error with pscs from companies house", e)
    })

    // Get filing list from Companies House

    const {
      data: { items: filing_data },
    } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}/filing-history?category=incorporation%2Cannual-return%2Cconfirmation-statement`,
      authentication
    )

    // Get Certificate of Incorporation

    const incorporation_transaction_id = R.pipe(
      R.filter((file: any) => file.category === "incorporation"),
      R.head,
      file => getLastPath(file.links.document_metadata)
    )(filing_data)

    const { data: _inc_data, ...incorporation } = await axios(
      `https://document-api.companieshouse.gov.uk/document/${incorporation_transaction_id}/content`,
      { headers: { Accept: "application/pdf" }, ...authentication }
    )

    const { data: incorporationDocument } = await axios.get(
      incorporation.request.res.responseUrl,
      {
        responseType: "stream",
      }
    )

    const { path: incorporation_path } = await file({
      postfix: ".pdf",
    })
    incorporationDocument.pipe(fs.createWriteStream(incorporation_path))

    // Get Latest Confirmation Statement / Annual Return

    const confirmation_transaction_id = R.pipe(
      R.filter(
        (file: any) =>
          file.category === "confirmation-statement" ||
          file.category === "annual-return"
      ),
      R.head,
      file => (file ? getLastPath(file.links.document_metadata) : null)
    )(filing_data)

    const getConfirmationPath = async () => {
      if (confirmation_transaction_id) {
        const { data: _conf_data, ...confirmation } = await axios(
          `https://document-api.companieshouse.gov.uk/document/${confirmation_transaction_id}/content`,
          { headers: { Accept: "application/pdf" }, ...authentication }
        )

        const { data: confirmationDocument } = await axios.get(
          confirmation.request.res.responseUrl,
          {
            responseType: "stream",
          }
        )

        const { path } = await file({
          postfix: ".pdf",
        })

        confirmationDocument.pipe(fs.createWriteStream(path))
        return path
      }
      return null
    }

    const confirmation_path = await getConfirmationPath()

    // @ts-ignore
    const ubos = R_.reduceIndexed((acc: any, ubo: any, index: number) => {
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
      Country:
        countryToISO(company_data.registered_office_address.country) || "GB",
      companyCodes: company_data.sic_codes,
      articlesOfAssociation: {
        name: "CH_incorporation.pdf",
        type: "application/pdf",
        size: 300000,
        fileOnServer: true,
        path: incorporation_path,
        webkitRelativePath: incorporation_path,
      },
      proofOfRegistration: {
        name: confirmation_path
          ? "CH_registration.pdf"
          : "CH_incorporation.pdf",
        type: "application/pdf",
        size: 300000,
        fileOnServer: true,
        path: confirmation_path ? confirmation_path : incorporation_path,
        webkitRelativePath: confirmation_path
          ? confirmation_path
          : incorporation_path,
      },
      ...ubos,
    }

    res.json({ company })
  } catch (e) {
    console.log("There was an error in /get-company-public endpoint: ", e) //eslint-disable-line no-console
  }
}
