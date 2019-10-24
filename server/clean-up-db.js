const { prisma } = require("../prisma/generated/js")

const cleanUpVerificationTokens = async () => {
  const verificationTokens = await prisma
    .deleteManyVerificationTokens({
      expiresAt_lt: new Date().toISOString(),
    })
    .catch(err => console.log("error cleaning up verification tokens:", err))

  console.log("deleted verification tokens:", verificationTokens)
}

const cleanUpPaymentRequests = async () => {
  const paymentRequests = await prisma
    .deleteManyPaymentRequests({
      expiresAt_lt: new Date().toISOString(),
    })
    .catch(err => console.log("error cleaning up payment requests:", err))

  console.log("deleted payment requests:", paymentRequests)
}

const cleanUpChildcareProviders = async () => {
  const approvedProviders = await prisma
    .updateManyChildcareProviders({
      where: { approved: true },
      data: { expiresAt: null },
    })
    .catch(err => console.log("error updating childcare providers:", err))

  console.log("approved childcare providers:", approvedProviders)

  const childcareProviders = await prisma
    .deleteManyChildcareProviders({
      expiresAt_lt: new Date().toISOString(),
    })
    .catch(err => console.log("error cleaning up childcare providers:", err))

  console.log("deleted childcare providers:", childcareProviders)
}

module.exports = {
  cleanUpVerificationTokens,
  cleanUpPaymentRequests,
  cleanUpChildcareProviders,
}
