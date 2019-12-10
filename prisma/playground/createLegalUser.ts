import mango from '../../lib/mango'
import fs from 'fs'

import { prisma } from '../generated/ts'

const run = async (): Promise<any> => {
  try {
    const legalUser = await mango.Users.create({
      HeadquartersAddress: {
        AddressLine1: 'Space4, 149 Fonthill Road',
        AddressLine2: null,
        City: 'London',
        Region: 'London',
        PostalCode: 'N4 3HF',
        Country: 'GB',
      },
      LegalRepresentativeAddress: {
        AddressLine1: 'Space4, 149 Fonthill Road',
        AddressLine2: null,
        City: 'London',
        Region: null,
        PostalCode: 'N4 3HF',
        Country: 'GB',
      },
      Name: 'Monday Cola',
      LegalPersonType: 'BUSINESS',
      LegalRepresentativeFirstName: 'Ivan',
      LegalRepresentativeLastName: 'Gonzalez',
      LegalRepresentativeEmail: 'ivan@infactcoop.com',
      LegalRepresentativeBirthday: 417225600,
      LegalRepresentativeNationality: 'GB',
      LegalRepresentativeCountryOfResidence: 'GB',
      CompanyNumber: '11912270',
      PersonType: 'LEGAL',
      Email: 'ivan@infactcoop.com',
    })

    const documents = [
      'IDENTITY_PROOF',
      'ARTICLES_OF_ASSOCIATION',
      'REGISTRATION_PROOF',
    ]

    const [
      { Id: proofId },
      { Id: associationId },
      { Id: proofRegId },
    ] = await Promise.all(
      documents.map(
        async (Type: any) =>
          await mango.Users.createKycDocument(legalUser.Id, {
            Type,
          }),
      ),
    )

    const File = Buffer.from(
      fs.readFileSync(`${__dirname}/mock-kyc.pdf`),
    ).toString('base64')

    await Promise.all(
      [proofId, associationId, proofRegId].map(
        async id => await mango.Users.createKycPage(legalUser.Id, id, { File }),
      ),
    )

    await Promise.all(
      [proofId, associationId, proofRegId].map(id =>
        mango.Users.updateKycDocument(legalUser.Id, {
          //@ts-ignore
          Id: id,
          Status: 'VALIDATION_ASKED',
        }),
      ),
    )

    // @ts-ignore
    const uboDeclaration = await mango.UboDeclarations.create(legalUser.Id)

    // @ts-ignore
    await mango.UboDeclarations.createUbo(legalUser.Id, uboDeclaration.Id, {
      FirstName: 'John_NodejsSDK',
      LastName: 'Doe_NodejsSDK',
      Address: {
        AddressLine1: '4101 Reservoir Rd NW',
        AddressLine2: '',
        City: 'Washington',
        Region: 'District of Columbia',
        PostalCode: 'SW3 9NG',
        Country: 'GB',
      },
      Nationality: 'GB',
      Birthday: new Date('12/21/1975').getTime(),
      Birthplace: {
        City: 'Washington',
        Country: 'US',
      },
    })

    //@ts-ignore
    await mango.UboDeclarations.update(legalUser.Id, {
      //@ts-ignore
      Id: uboDeclaration.Id,
      Status: 'VALIDATION_ASKED',
      Ubos: {},
    })

    const legalUserWallet = await mango.Wallets.create({
      Owners: [legalUser.Id],
      Description: 'Legal User Wallet',
      Currency: 'GBP',
    })

    const legalUserBankAccount = await mango.Users.createBankAccount(
      legalUser.Id,
      {
        // @ts-ignore
        Type: 'GB',
        // @ts-ignore
        OwnerName: legalUser.Name,
        // @ts-ignore
        OwnerAddress: {
          AddressLine1: 'Space4, 149 Fonthill Road',
          AddressLine2: null,
          City: 'London',
          Region: 'London',
          PostalCode: 'N4 3HF',
          Country: 'GB',
        },
        SortCode: '400216',
        // @ts-ignore
        AccountNumber: '81533509',
      },
    )

    const employee = await prisma.user({
      email: 'ivan@infactcoop.com',
    })

    await prisma.updateChildcareProvider({
      where: {
        companyNumber: '11912270',
      },
      data: {
        mangoWalletId: legalUserWallet.Id,
        mangoLegalUserId: legalUser.Id,
        mangoBankAccountId: legalUserBankAccount.Id,
        paymentRequests: {
          create: [
            {
              amountToPay: 1000,
              consentToPay: true,
              expiresAt: new Date('2020-12-12').toISOString(),
              reference: 'Mock reference',
              user: {
                connect: {
                  email: employee.email,
                },
              },
            },
          ],
        },
      },
    })

    // eslint-disable-next-line
    console.log('Legal User: ', JSON.stringify(legalUser, undefined, 2))
    // eslint-disable-next-line
    console.log(
      'Legal User wallet: ',
      JSON.stringify(legalUserWallet, undefined, 2),
    )
    // eslint-disable-next-line
    console.log(
      'Legal User bank account: ',
      JSON.stringify(legalUserBankAccount, undefined, 2),
    )
    // eslint-disable-next-line
    console.log('SUCCESS')
  } catch (err) {
    // eslint-disable-next-line
    console.error(err)
  }
}

run()
