import { prisma } from "./generated/ts"

const flushDB = async () => {
  const deletePaymentRequests = await prisma.deleteManyPaymentRequests({
    id_not: 0,
  })

  const deleteChildcareProviders = await prisma.deleteManyChildcareProviders({
    id_not: 0,
  })

  const deleteUsers = await prisma.deleteManyUsers({
    id_not: 0,
  })

  const deleteEmployers = await prisma.deleteManyEmployers({
    id_not: 0,
  })

  console.log(JSON.stringify(deleteChildcareProviders, undefined, 2)) //eslint-disable-line no-console
  console.log(JSON.stringify(deletePaymentRequests, undefined, 2)) //eslint-disable-line no-console
  console.log(JSON.stringify(deleteEmployers, undefined, 2)) //eslint-disable-line no-console
  console.log(JSON.stringify(deleteUsers, undefined, 2)) //eslint-disable-line no-console
}

// flushDB()
export default flushDB
