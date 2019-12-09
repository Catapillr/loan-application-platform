import { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import fs from "fs"
import { file } from "tmp-promise"
import * as R from "ramda"
import R_ from "../../utils/R_"

import countryToISO from "../../utils/countryToISO"
import nationalityToISO from "../../utils/nationalityToISO"
import getLastPath from "../../utils/getLastPath"

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  try {
    const authentication = {
      auth: {
        username: process.env.COMPANIES_HOUSE_API,
        password: "",
      },
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    const { company_number } = req.query

    const { data: companyData } = await axios(
      // eslint-disable-next-line @typescript-eslint/camelcase
      `https://api.companieshouse.gov.uk/company/${company_number}`,
      authentication
    )

    const {
      data: { items: uboData },
    } = await axios(
      // eslint-disable-next-line @typescript-eslint/camelcase
      `https://api.companieshouse.gov.uk/company/${company_number}/persons-with-significant-control`,
      authentication
    ).catch(e => {
      const [{ error }] = e.response.data.errors
      if (error === "company-psc-not-found") {
        return { data: { items: [] } }
      }

      // eslint-disable-next-line no-console
      console.log("Error with pscs from companies house", e)
    })

    // Get filing list from Companies House

    const {
      data: { items: filingData },
    } = await axios(
      `https://api.companieshouse.gov.uk/company/${company_number}/filing-history?category=incorporation%2Cannual-return%2Cconfirmation-statement`,
      authentication
    )

    // Get Certificate of Incorporation

    const incorporationTransactionId = R.pipe(
      R.filter((file: any) => file.category === "incorporation"),
      R.head,
      file => getLastPath(file.links.document_metadata)
    )(filingData)

    const { data: _incData, ...incorporation } = await axios(
      `https://document-api.companieshouse.gov.uk/document/${incorporationTransactionId}/content`,
      { headers: { Accept: "application/pdf" }, ...authentication }
    )

    const { data: incorporationDocument } = await axios.get(
      incorporation.request.res.responseUrl,
      {
        responseType: "stream",
      }
    )

    const { path: incorporationPath } = await file({
      postfix: ".pdf",
    })

    incorporationDocument.pipe(fs.createWriteStream(incorporationPath))

    // Get Latest Confirmation Statement / Annual Return

    const confirmationTransactionId = R.pipe(
      R.filter(
        (file: any) =>
          file.category === "confirmation-statement" ||
          file.category === "annual-return"
      ),
      R.head,
      file => (file ? getLastPath(file.links.document_metadata) : null)
    )(filingData)

    const getConfirmationPath = async (): Promise<any> => {
      if (confirmationTransactionId) {
        const { data: _confData, ...confirmation } = await axios(
          `https://document-api.companieshouse.gov.uk/document/${confirmationTransactionId}/content`,
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

<<<<<<< HEAD
    const confirmation_path = await getConfirmationPath()
=======
    const confirmationPath = getConfirmationPath()
>>>>>>> staging

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
    }, {})(uboData)

    const company = {
      businessName: companyData.company_name,
      companyNumber: companyData.company_number,
      AddressLine1: companyData.registered_office_address.address_line_1,
      AddressLine2: companyData.registered_office_address.address_line_2,
      City: companyData.registered_office_address.locality,
      Region: companyData.registered_office_address.locality,
      PostalCode: companyData.registered_office_address.postal_code,
      Country:
        countryToISO(companyData.registered_office_address.country) || "GB",
      companyCodes: companyData.sic_codes,
      articlesOfAssociation: {
        name: "CH_incorporation.pdf",
        type: "application/pdf",
        size: 300000,
        fileOnServer: true,
        path: incorporationPath,
        webkitRelativePath: incorporationPath,
      },
      proofOfRegistration: {
        name: confirmationPath ? "CH_registration.pdf" : "CH_incorporation.pdf",
        type: "application/pdf",
        size: 300000,
        fileOnServer: true,
        path: confirmationPath || incorporationPath,
        webkitRelativePath: confirmationPath || incorporationPath,
      },
      ...ubos,
    }

    res.json({ company })
  } catch (e) {
    console.log("There was an error in /get-company-public endpoint: ", e) //eslint-disable-line no-console
  }
}
