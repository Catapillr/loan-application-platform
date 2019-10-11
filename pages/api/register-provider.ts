import { NextApiRequest, NextApiResponse } from "next"
// import moment from "moment"
import formidable from "formidable"

import mango from "../../lib/mango"

// import { prisma } from "../../prisma/generated/ts"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  // const user = req.user

  const form = new formidable.IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return console.error("Listen for signEvent error", err) //eslint-disable-line no-console
    }

    const kycDocument = await mango.Users.createKycDocument("69681155", {
      Type: "IDENTITY_PROOF",
    })

    console.log("woooooooooooo", fields)
    console.log("woooooooooooo", files)
  })
  // console.log("woooooooooooooooooooooooooooooooooo", req.body)
  // const {
  //   businessName,
  //   businessEmail,
  //   childcareProviderEmail,
  //   companyNumber,
  //   ownerFirstName,
  //   ownerLastName,
  //   ownerKeyContact,
  //   ownerDob,
  //   ownerCountryOfResidence,
  //   ownerNationality,
  //   proofOfId: {
  //     name: iDName,
  //     lastModified: iDlastModified,
  //     lastModifiedDate: iDlastModifiedDate,
  //     webkitRelativePath: iDwebkitRelativePath,
  //   },
  //   articlesOfAssociation: {
  //     articlesName: articlesName,
  //     lastModified: articlesLastModified,
  //     lastModifiedDate: articlesLastModifiedDate,
  //     webkitRelativePath: articlesWebkitRelativePath,
  //   },
  //   proofOfRegistration: {
  //     name: registrationName,
  //     registrationLastModified,
  //     registrationLastModifiedDate,
  //     registratinWebkitRelativePath,
  //   },
  //   bankName,
  //   accountNumber,
  //   sortCode: { firstSection, secondSection, thirdSection },
  //   AddressLine1,
  //   AddressLine2,
  //   City,
  //   Region,
  //   PostalCode,
  //   Country,
  // } = req.body
  //
  // mango.Users.create({
  //   PersonType: "LEGAL",
  //   HeadquartersAddress: {
  //     AddressLine1,
  //     AddressLine2,
  //     City,
  //     Region,
  //     PostalCode,
  //     Country,
  //   },
  //   LegalPersonType: "BUSINESS",
  //   Name: businessName,
  //   LegalRepresentativeBirthday: moment(ownerDob).unix(),
  //   LegalRepresentativeCountryOfResidence: ownerCountryOfResidence,
  //   LegalRepresentativeNationality: ownerNationality,
  //   LegalRepresentativeEmail: businessEmail,
  //   LegalRepresentativeFirstName: ownerFirstName,
  //   LegalRepresentativeLastName: ownerLastName,
  //   Email: childcareProviderEmail,
  //   CompanyNumber: companyNumber,
  // })

  // 2. Create a mango legal user
  // create kyc
  // create ubo
  // 3. Create a mango wallet for that user
  // 4. Check whether we can create bank account straight away, if not listen for validation hook and create one then
  // 5. Update prisma with childcare provider

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
  //   amountToPay: convertToPennies(amountToPay),
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
}

export const config = {
  api: {
    bodyParser: false,
  },
}
