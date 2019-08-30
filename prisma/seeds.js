// to seed the database go to your terminal and run
// env-cmd -f ./.config/dev.env node ./prisma/seeds.js

const { prisma } = require("./generated")

prisma
  .createEmployer({
    name: "yalla",
    slug: "yalla",
    emailSuffix: "@yallacooperative.com",
  })
  .then(res => console.log(JSON.stringify(res, undefined, 2))) //eslint-disable-line no-console
  .catch(res => console.log(JSON.stringify(res, undefined, 2))) //eslint-disable-line no-console

prisma
  .createEmployer({
    name: "infact",
    slug: "infact",
    emailSuffix: "@infactcoop.com",
  })
  .then(res => console.log(JSON.stringify(res, undefined, 2))) //eslint-disable-line no-console
  .catch(res => console.log(JSON.stringify(res, undefined, 2))) //eslint-disable-line no-console
