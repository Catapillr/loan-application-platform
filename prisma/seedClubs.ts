// To seed the database
// 1. Install ts-node - `yarn global add typescript ts-node`
// 2. Go to your terminal make sure you are in `loan-application-platform/prisma/` directory
// 3. run `env-cmd -f ../.config/dev.env ts-node seeds.ts`

import { prisma } from './generated/ts'

const seedClubsToDatabase = async () => {
  try {
    const [
      Nationwide,
      London,
      Hampshire,
      Berkshire,
      Surrey,
      Essex,
    ] = await Promise.all([
      prisma.createLocation({
        location: 'Nationwide',
      }),
      prisma.createLocation({
        location: 'London',
      }),
      prisma.createLocation({
        location: 'Hampshire',
      }),
      prisma.createLocation({
        location: 'Berkshire',
      }),
      prisma.createLocation({
        location: 'Surrey',
      }),
      prisma.createLocation({
        location: 'Essex',
      }),
    ])

    const NationwideClubs = await Promise.all([
      prisma.createSchoolHolidayClubs({
        companyName: 'Super Camps',
        companyNumber: '03267803',
        websiteURL: 'https://www.supercamps.co.uk',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025218/Super_Camps_qlbcqk.jpg',
        location: {
          connect: [{ id: Nationwide.id }],
        },
      }),
      prisma.createSchoolHolidayClubs({
        companyName: 'Fit for Sport',
        companyNumber: '03648410',
        websiteURL: 'https://www.fitforsport.co.uk',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025218/Fit_for_Sport_yiatun.png',
        location: {
          connect: [{ id: Nationwide.id }],
        },
      }),
      prisma.createSchoolHolidayClubs({
        companyName: 'Energy Kidz',
        companyNumber: '09521272',
        websiteURL: 'https://www.energy-kidz.co.uk',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025218/Energy_Kidz_rcn4jz.jpg',
        location: {
          connect: [{ id: Nationwide.id }],
        },
      }),
      prisma.createSchoolHolidayClubs({
        companyName: 'Kings Camps',
        companyNumber: '05099069',
        websiteURL: 'https://www.kingscamps.org',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025221/Kings_Camps_mcbojh.jpg',
        location: {
          connect: [{ id: Nationwide.id }],
        },
      }),
      prisma.createSchoolHolidayClubs({
        companyName: 'Barracudas',
        companyNumber: '02764956',
        websiteURL: 'https://www.barracudas.co.uk',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025205/barracudas_hgktmr.jpg',
        location: {
          connect: [{ id: Nationwide.id }],
        },
      }),
      prisma.createSchoolHolidayClubs({
        companyName: 'Premier Education',
        companyNumber: '03774725',
        websiteURL: 'https://www.premier-education.com/holidaycamps',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025218/Premier_Education_aknfwh.png',
        location: {
          connect: [{ id: Nationwide.id }],
        },
      }),
    ])

    const LondonClubs = await Promise.all([
      prisma.createSchoolHolidayClubs({
        companyName: 'Camp Beaumont',
        companyNumber: '02670032',
        websiteURL: 'https://www.campbeaumont.co.uk',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025217/Camp_Beaumont_osehwh.jpg',
        location: {
          connect: [{ id: London.id }],
        },
      }),
    ])

    const HampshireClubs = await Promise.all([
      prisma.createSchoolHolidayClubs({
        companyName: 'Kidz Camps',
        companyNumber: '10472849',
        websiteURL: 'https://www.kidzcamps-uk.com',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025218/Kidz_Camps_UK_a0jgec.png',
        location: {
          connect: [{ id: Hampshire.id }],
        },
      }),
    ])

    // const BerkshireClubs = await Promise.all([
    // prisma.createSchoolHolidayClubs({
    //   companyName: '',
    //   companyNumber: '',
    //   websiteURL: '',
    //   imgURL: '',
    //   location: {
    //     connect: [{ id: Berkshire.id }],
    //   },
    // }),
    // ])

    // const SurreyClubs = await Promise.all([
    //   prisma.createSchoolHolidayClubs({
    //     companyName: '',
    //     companyNumber: '',
    //     websiteURL: '',
    //     imgURL: '',
    //     location: {
    //       connect: [{ id: Surrey.id }],
    //     },
    //   }),
    // ])

    const EssexClubs = await Promise.all([
      prisma.createSchoolHolidayClubs({
        companyName: 'Active Stars',
        companyNumber: '11058699',
        websiteURL: 'https://activestarsholidayclub.co.uk',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025211/Active_Stars_kokmas.jpg',
        location: {
          connect: [{ id: Essex.id }],
        },
      }),
    ])

    const JointClubs = await Promise.all([
      prisma.createSchoolHolidayClubs({
        companyName: 'Koosa Kids',
        companyNumber: '05426131',
        websiteURL: 'https://www.koosakids.co.uk',
        imgURL:
          'https://res.cloudinary.com/hfapr8p3a/image/upload/v1579025222/Koosa_Kids_xofoow.jpg',
        location: {
          connect: [
            { id: Hampshire.id },
            { id: Berkshire.id },
            { id: London.id },
            { id: Surrey.id },
          ],
        },
      }),
    ])

    console.log(JSON.stringify(NationwideClubs, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(LondonClubs, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(HampshireClubs, undefined, 2)) //eslint-disable-line no-console
    // console.log(JSON.stringify(BerkshireClubs, undefined, 2)) //eslint-disable-line no-console
    // console.log(JSON.stringify(SurreyClubs, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(EssexClubs, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(JointClubs, undefined, 2)) //eslint-disable-line no-console
  } catch (e) {
    console.log(JSON.stringify(e, undefined, 2)) //eslint-disable-line no-console
    return
  }
}

// seedClubsToDatabase()
export default seedClubsToDatabase
