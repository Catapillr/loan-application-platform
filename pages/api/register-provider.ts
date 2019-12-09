import { NextApiRequest, NextApiResponse } from 'next'
import * as R from 'ramda'
import moment from 'moment'
import formidable from 'formidable'

import mango from '../../lib/mango'
import { prisma } from '../../prisma/generated/ts'
import { sendProviderApplicationCompleteConfirmation } from '../../utils/mailgunClient'
import zeroIndexMonth from '../../utils/zeroIndexMonth'

const GBP = 'GBP'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return console.error('Listen for signEvent error', err) //eslint-disable-line no-console
      }

      const {
        businessName,
        businessEmail,
        childcareProviderEmail,
        companyNumber,
        repFirstName,
        repLastName,
        repDob,
        repCountryOfResidence,
        repNationality,
        accountNumber,
        sortCode,
        AddressLine1,
        AddressLine2,
        City,
        Region,
        PostalCode,
        Country,
        ubo1,
        ubo2,
        ubo3,
        ubo4,
        articlesOfAssociation,
        proofOfRegistration,
      } = fields

      // 1. Create legal user

      const LegalRepresentativeBirthday = moment
        .utc(zeroIndexMonth(JSON.parse(repDob as string)))
        .unix()

      // @ts-ignore
      const providerLegalUser = await mango.Users.create({
        PersonType: 'LEGAL',
        LegalPersonType: 'BUSINESS',
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
        LegalRepresentativeCountryOfResidence: repCountryOfResidence,
        LegalRepresentativeNationality: repNationality,
        LegalRepresentativeEmail: businessEmail,
        LegalRepresentativeFirstName: repFirstName,
        LegalRepresentativeLastName: repLastName,
        CompanyNumber: companyNumber,
      }).catch(e => {
        const error = {
          error: e,
          url: `${process.env.HOST}/api/register-provider`,
          name: businessName,
          time: new Date().toISOString(),
        }

        console.error(
          'Error in page /register-provider => Legal user creation error',
          error,
        )
        throw e
      })

      // 2. Upload KYC Documents

      type KycDocument =
        | 'IDENTITY_PROOF'
        | 'REGISTRATION_PROOF'
        | 'ARTICLES_OF_ASSOCIATION'

      const createDocumentWithPages = async (file: any, Type: KycDocument) => {
        try {
          const document = await mango.Users.createKycDocument(
            providerLegalUser.Id,
            {
              Type,
            },
          )

          await mango.Users.createKycPageFromFile(
            providerLegalUser.Id,
            document.Id,
            file.path,
          )

          const updateDocument = await mango.Users.updateKycDocument(
            providerLegalUser.Id,
            {
              Status: 'VALIDATION_ASKED',
              // @ts-ignore
              Id: document.Id,
            },
          )

          return updateDocument
        } catch (e) {
          const error = {
            error: e,
            url: `${process.env.HOST}/api/register-provider`,
            name: businessName,
            owner: providerLegalUser.Id,
            time: new Date().toISOString(),
          }

          console.error(
            `Error in page /register-provider => Issue creating KYC document ${Type}`,
            error,
          )
          throw e
        }
      }

      createDocumentWithPages(files.repProofOfId, 'IDENTITY_PROOF')
      createDocumentWithPages(
        files.proofOfRegistration || JSON.parse(proofOfRegistration as string),
        'REGISTRATION_PROOF',
      )
      createDocumentWithPages(
        files.articlesOfAssociation ||
          JSON.parse(articlesOfAssociation as string),
        'ARTICLES_OF_ASSOCIATION',
      )

      // 3. Create and submit UBO declaration
      if (ubo1 || ubo2 || ubo3 || ubo4) {
        //@ts-ignore
        const uboDeclaration = await mango.UboDeclarations.create(
          providerLegalUser.Id,
        )

        const uboPromises: any[] = R.pipe(
          //@ts-ignore
          R.filter(ubo => !!ubo),
          R.map((ubo: string) => JSON.parse(ubo)),
          R.map(async (ubo: any) => {
            // @ts-ignore
            return await mango.UboDeclarations.createUbo(
              providerLegalUser.Id,
              uboDeclaration.Id,
              {
                FirstName: ubo.FirstName,
                LastName: ubo.LastName,
                Nationality: ubo.Nationality,
                Birthday: moment.utc(zeroIndexMonth(ubo.Birthday)).unix(),
                Address: ubo.Address,
                Birthplace: ubo.Birthplace,
              },
            )
          }),
        )([ubo1, ubo2, ubo3, ubo4])

        const Ubos = await Promise.all(uboPromises).catch(e => {
          const error = {
            error: e,
            url: `${process.env.HOST}/api/register-provider`,
            name: businessName,
            owner: providerLegalUser.Id,
            time: new Date().toISOString(),
          }

          console.error(
            'Error in page /register-provider => UBO creation error',
            error,
          )
          throw e
        })

        await mango.UboDeclarations.update(providerLegalUser.Id, {
          //@ts-ignore
          Id: uboDeclaration.Id,
          Ubos,
          Status: 'VALIDATION_ASKED',
        }).catch(e => {
          const error = {
            error: e,
            url: `${process.env.HOST}/api/register-provider`,
            name: businessName,
            owner: providerLegalUser.Id,
            time: new Date().toISOString(),
          }

          console.error(
            'Error in page /register-provider => UBO declaration update error',
            error,
          )
          throw e
        })
      }

      // 4. Create a mango wallet for that user
      const providerWallet = await mango.Wallets.create({
        Owners: [providerLegalUser.Id],
        Description: `Provider wallet - ${repFirstName} ${repLastName} - mangoID: ${providerLegalUser.Id}`,
        Currency: GBP,
      }).catch(e => {
        const error = {
          error: e,
          url: `${process.env.HOST}/api/register-provider`,
          name: businessName,
          owner: providerLegalUser.Id,
          time: new Date().toISOString(),
        }

        console.error(
          'Error in page /register-provider => Wallet creation error',
          error,
        )
        throw e
      })

      // 5. Create a bank account for that user
      const sortCodeString = R.pipe(
        JSON.parse,
        ({ firstSection, secondSection, thirdSection }) =>
          `${firstSection}${secondSection}${thirdSection}`,
      )(sortCode as string)

      const providerBankAccount = await mango.Users.createBankAccount(
        providerLegalUser.Id,
        {
          // @ts-ignore
          Type: 'GB',
          // @ts-ignore
          OwnerName: businessName,
          // @ts-ignore
          OwnerAddress: {
            AddressLine1,
            AddressLine2,
            City,
            Region,
            PostalCode,
            Country,
          },
          SortCode: sortCodeString,
          // @ts-ignore
          AccountNumber: accountNumber,
        },
      ).catch(e => {
        const error = {
          error: e,
          url: `${process.env.HOST}/api/register-provider`,
          name: businessName,
          owner: providerLegalUser.Id,
          time: new Date().toISOString(),
        }

        console.error(
          'Error in page /register-provider => Bank account creation error',
          error,
        )
        throw e
      })

      // 6. Update prisma with childcare provider
      const updateChildcareProvider = await prisma
        .updateChildcareProvider({
          data: {
            mangoLegalUserId: providerLegalUser.Id,
            mangoBankAccountId: providerBankAccount.Id,
            mangoWalletId: providerWallet.Id,
            expiresAt: null,
          },
          where: { email: childcareProviderEmail as string },
        })
        .catch(e => {
          const error = {
            error: e,
            url: `${process.env.HOST}/api/register-provider`,
            name: businessName,
            owner: providerLegalUser.Id,
            time: new Date().toISOString(),
          }

          console.error(
            'Error in page /register-provider => Provider update error',
            error,
          )
          throw e
        })

      // 7. Send email notification to childcare provider
      sendProviderApplicationCompleteConfirmation({
        email: childcareProviderEmail,
      })

      res.status(200).json({ childcareProviderId: updateChildcareProvider.id })
    })
  } catch (e) {
    console.log('There was an error registering this childcare provider: ', e) //eslint-disable-line no-console
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
