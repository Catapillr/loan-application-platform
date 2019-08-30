// to seed the database go to your terminal and run
// env-cmd -f ./.config/dev.env node ./prisma/seeds.js

const { prisma } = require("./generated")

const seedDatabase = async () => {
  try {
    const deleteUsers = await prisma.deleteManyUsers({
      id_not: 0,
    })

    const deleteEmployers = await prisma.deleteManyEmployers({
      id_not: 0,
    })

    const yalla = await prisma.createEmployer({
      name: "yalla",
      slug: "yalla",
      emailSuffix: "@yallacooperative.com",
    })

    const infact = await prisma.createEmployer({
      name: "infact",
      slug: "infact",
      emailSuffix: "@infactcoop.com",
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

    console.log(JSON.stringify(deleteEmployers, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(deleteUsers, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(yalla, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(infact, undefined, 2)) //eslint-disable-line no-console
    console.log(JSON.stringify(ivan, undefined, 2)) //eslint-disable-line no-console
  } catch (e) {
    console.log(JSON.stringify(e, undefined, 2)) //eslint-disable-line no-console
  }
}

seedDatabase()
