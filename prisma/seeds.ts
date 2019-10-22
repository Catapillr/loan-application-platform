// To seed the database
// 1. Install ts-node - `yarn global add typescript ts-node`
// 2. Go to your terminal make sure you are in `loan-application-platform/prisma/` directory
// 3. run `env-cmd -f ../.config/dev.env ts-node seeds.ts`

import { prisma } from "./generated/ts"
import flushDB from "./flushDB"

const seedDatabase = async () => {
  try {
    await flushDB()

    const yalla = await prisma.createEmployer({
      name: "yalla",
      slug: "yalla",
      maximumAmount: 2000000,
      minimumServiceLength: 8,
      maxSalaryPercentage: 25,
      payrollEmail: "j@yallacooperative.com",
      signerEmail: "j@yallacooperative.com",
      address: "149 Fonthill Road, London, N4 3HF",
    })

    await prisma.createSuffix({
      domain: "@yallacooperative.com",
      employer: {
        connect: {
          slug: "yalla",
        },
      },
    })

    await prisma.createSuffix({
      domain: "@yalla.com",
      employer: {
        connect: {
          slug: "yalla",
        },
      },
    })

    const infact = await prisma.createEmployer({
      name: "infact",
      slug: "infact",
      maximumAmount: 3000000,
      minimumServiceLength: 6,
      maxSalaryPercentage: 20,
      payrollEmail: "hello@infactcoop.com",
      signerEmail: "hello@infactcoop.com",
      address: "149 Fonthill Road, London, N4 3HF",
      companyNumber: "11912270",
      emailSuffixes: null,
    })

    await prisma.createSuffix({
      domain: "@infactcoop.com",
      employer: {
        connect: {
          slug: "infact",
        },
      },
    })

    await prisma.createSuffix({
      domain: "@infact.com",
      employer: {
        connect: {
          slug: "infact",
        },
      },
    })

    const ivan = await prisma.createUser({
      firstName: "Ivan",
      lastName: "Gonzalez",
      email: "ivan@infactcoop.com",
      phoneNumber: "+447939656400",
      dob: new Date().toISOString(),
      nationality: "Colombian",
      employmentStartDate: new Date().toISOString(),
      annualSalary: 28392382,
      employer: { connect: { id: infact.id } },
      mangoUserId: "70443751",
      mangoWalletId: "70449806",
      loan: {
        create: {
          amount: 200000,
          terms: 12,
          approved: true,
        },
      },
      gdprConsent: true,
      payIns: {
        create: [
          {
            mangoPayInId: "70294171",
            employer: {
              connect: {
                slug: "infact",
              },
            },
          },
        ],
      },
    })

    const ivanLittleOnes = await prisma.createPaymentRequest({
      user: {
        connect: {
          email: "ivan@infactcoop.com",
        },
      },
      childcareProvider: {
        create: {
          email: "suzanne@littleonesnursery.org.uk",
          companyNumber: "11790309",
          approved: false,
          expiresAt: "2019-11-22T13:57:31.123Z",
        },
      },
      amountToPay: 12300,
      consentToPay: true,
      reference: "Little ones after school club",
      expiresAt: "2019-11-22T13:57:31.123Z",
    })

    const ivanPayIn = console.log(JSON.stringify(yalla, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(infact, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(ivan, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(ivanLittleOnes, undefined, 2)) //eslint-disable-line no-console
  } catch (e) {
    console.log(JSON.stringify(e, undefined, 2)) //eslint-disable-line no-console
  }
}

seedDatabase()
