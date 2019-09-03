const { prisma } = require("./generated")

const flushDB = async () => {
  const deleteUsers = await prisma.deleteManyUsers({
    id_not: 0,
  })

  const deleteEmployers = await prisma.deleteManyEmployers({
    id_not: 0,
  })

  const deleteEligibilityCriteria = await prisma.deleteManyEligibilityCriterias(
    {
      id_not: 0,
    }
  )

  console.log(JSON.stringify(deleteEmployers, undefined, 2)) //eslint-disable-line no-console
  console.log(JSON.stringify(deleteUsers, undefined, 2)) //eslint-disable-line no-console
  console.log(JSON.stringify(deleteEligibilityCriteria, undefined, 2)) //eslint-disable-line no-console
}

// flushDB()
module.exports = flushDB
