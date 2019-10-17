import { NextApiRequest, NextApiResponse } from "next"
import * as R from "ramda"
import moment from "moment"
import formidable from "formidable"

import mango from "../../lib/mango"

import { prisma } from "../../prisma/generated/ts"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  const user = req.user

  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return console.error("Listen for signEvent error", err) //eslint-disable-line no-console
    }

    // 1. Create legal user

    const {
      businessName,
      businessEmail,
      childcareProviderEmail,
      companyNumber,
      ownerFirstName,
      ownerLastName,
      ownerKeyContact,
      ownerDob,
      ownerCountryOfResidence,
      ownerNationality,
      bankName,
      accountNumber,
      sortCode,
      AddressLine1,
      AddressLine2,
      City,
      Region,
      PostalCode,
      Country,
    } = fields

    // @ts-ignore
    const LegalRepresentativeBirthday = moment(JSON.parse(ownerDob)).unix()

    // @ts-ignore
    const providerLegalUser = await mango.Users.create({
      PersonType: "LEGAL",
      LegalPersonType: "BUSINESS",
      Name: businessName,
      Email: childcareProviderEmail,
      HeadquartersAddress: {
        AddressLine1,
        AddressLine2,
        City,
        Region,
        PostalCode,
        Country,
      },
      LegalRepresentativeBirthday,
      LegalRepresentativeCountryOfResidence: ownerCountryOfResidence,
      LegalRepresentativeNationality: ownerNationality,
      LegalRepresentativeEmail: businessEmail,
      LegalRepresentativeFirstName: ownerFirstName,
      LegalRepresentativeLastName: ownerLastName,
      CompanyNumber: companyNumber,
    })

    type KycDocument =
      | "IDENTITY_PROOF"
      | "REGISTRATION_PROOF"
      | "ARTICLES_OF_ASSOCIATION"

    const createDocumentWithPages = async (file: any, Type: KycDocument) => {
      try {
        const document = await mango.Users.createKycDocument(
          providerLegalUser.Id,
          {
            Type,
          }
        )

        await mango.Users.createKycPageFromFile(
          providerLegalUser.Id,
          document.Id,
          file.path
        )

        const updateDocument = await mango.Users.updateKycDocument(
          providerLegalUser.Id,
          {
            Status: "VALIDATION_ASKED",
            // @ts-ignore
            Id: document.Id,
          }
        )

        return updateDocument
      } catch (e) {
        console.error(`There has been an issue creating document ${Type}: `, e)
      }
    }

    createDocumentWithPages(files.proofOfId, "IDENTITY_PROOF")
    createDocumentWithPages(files.proofOfRegistration, "REGISTRATION_PROOF")
    createDocumentWithPages(
      files.articlesOfAssociation,
      "ARTICLES_OF_ASSOCIATION"
    )

    // 3. Create and submit UBO declaration
    // 4. Create a mango wallet for that user
    // 5. Check whether we can create bank account straight away, if not listen for validation hook and create one then
    // 6. Update prisma with childcare provider

    // const expiresAt = moment()
    //   .add(expiryDays, "days")
    //   .toDate()

    // const { Id: newWalletId } = await mango.Wallets.create({
    //   Owners: [newMangoUserId],
    //   Description: `Employee wallet - ${employee.firstName} ${employee.lastName} - mangoID: ${newMangoUserId}`,
    //   Currency: GBP,
    // })
    //
    // const { Id: newWalletId } = await mango.Wallets.create({
    //   Owners: [newMangoUserId],
    //   Description: `Employee wallet - ${employee.firstName} ${employee.lastName} - mangoID: ${newMangoUserId}`,
    //   Currency: GBP,
    // })

    // const newChildcareProvider = await prisma.createChildcareProvider({
    //   email: providerEmail,
    //   companyNumber,
    //   expiresAt,
    //   approved: false,
    // })
    //
    // await prisma.createPaymentRequest({
    //   user: {
    //     connect: {
    //       email: user.email,
    //     },
    //   },
    //   childcareProvider: {
    //     connect: {
    //       id: newChildcareProvider.id,
    //     },
    //   },
    //   amountToPay: poundsToPennies(amountToPay),
    //   consentToPay,
    //   expiresAt,
    //   reference,
    // })
    //
    // sendPaymentRequestDetails({
    //   user,
    //   email: newChildcareProvider.email,
    //   amountToPay,
    //   slug: newChildcareProvider.id,
    // })
    //
    // res.status(200).json({ childcareProviderId: newChildcareProvider.id })
    res.status(200).end()
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
