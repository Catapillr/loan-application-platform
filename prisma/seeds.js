// to seed the database go to your terminal and run
// env-cmd -f ./.config/dev.env node ./prisma/seeds.js

const { prisma } = require("./generated")
const flushDB = require("./flushDB")

const seedDatabase = async () => {
  try {
    await flushDB()

    const yalla = await prisma.createEmployer({
      name: "yalla",
      slug: "yalla",
      emailSuffix: "@yallacooperative.com",
      maximumAmount: 2000,
      minimumServiceLength: 8,
      maxSalaryPercentage: 25,
      payrollEmail: "j@yallacooperative.com",
      signerEmail: "j@yallacooperative.com",
    })

    const infact = await prisma.createEmployer({
      name: "infact",
      slug: "infact",
      emailSuffix: "@infactcoop.com",
      maximumAmount: 3000,
      minimumServiceLength: 6,
      maxSalaryPercentage: 20,
      payrollEmail: "lucy@infactcoop.com",
      signerEmail: "ivan@infactcoop.com",
    })

    const ivan = await prisma.createUser({
      firstName: "Ivan",
      lastName: "Gonzalez",
      email: "ivan@infactcoop.com",
      phoneNumber: new Date().toISOString(),
      dob: new Date().toISOString(),
      nationality: "Colombian",
      employmentStartDate: new Date().toISOString(),
      annualSalary: 28392382,
      employer: { connect: { id: infact.id } },
    })

    console.log(JSON.stringify(yalla, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(infact, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(ivan, undefined, 2)) //eslint-disable-line no-console
  } catch (e) {
    console.log(JSON.stringify(e, undefined, 2)) //eslint-disable-line no-console
  }
}

seedDatabase()
