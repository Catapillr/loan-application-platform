import { NextApiRequest, NextApiResponse } from "next"
import moment from "moment"
import mangopay from "mangopay2-nodejs-sdk"
import formidable from "formidable"

const mango = new mangopay({
  clientId: process.env.MANGO_CLIENT_ID,
  clientApiKey: process.env.MANGO_KEY,
  // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
  // baseUrl: "https://api.mangopay.com",
})

// import { prisma } from "../../prisma/generated/ts"

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

    mango.Users.create({
      PersonType: "LEGAL",
      HeadquartersAddress: {
        AddressLine1,
        AddressLine2,
        City,
        Region,
        PostalCode,
        Country,
      },
      LegalPersonType: "BUSINESS",
      Name: businessName,
      LegalRepresentativeBirthday: moment(ownerDob).unix(),
      LegalRepresentativeCountryOfResidence: ownerCountryOfResidence,
      LegalRepresentativeNationality: ownerNationality,
      LegalRepresentativeEmail: businessEmail,
      LegalRepresentativeFirstName: ownerFirstName,
      LegalRepresentativeLastName: ownerLastName,
      Email: childcareProviderEmail,
      CompanyNumber: companyNumber,
    })

    // create kyc

    const kycDocument = await mango.Users.createKycDocument("124", {
      Type: "IDENTITY_PROOF",
    })
  })
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
