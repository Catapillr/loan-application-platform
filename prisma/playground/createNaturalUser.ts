import { prisma } from "../generated/ts"
import mango from "../../lib/mango"
import moment from "moment"
import mangopay from "mangopay2-nodejs-sdk"
import R from "ramda"
import { sendLoanTransferDetails } from "../../utils/mailgunClient"
import calculatePlatformFees from "../../utils/calculatePlatformFees"

const Natural = "NATURAL"
const GBP = "GBP"

const run = async () => {
  try {
    const employee: any = await prisma.user({
      email: "ivan@infactcoop.com",
    }).$fragment(`
      fragment EmployeeWithLoan on User {
        firstName
        lastName
        email
        dob
        nationality
        loan {
          amount
        }
        employer {
          id
          minimumLoanFee
        }
      }
    `)

    const { Id: newMangoUserId } = await mango.Users.create({
      FirstName: employee.firstName,
      LastName: employee.lastName,
      Birthday: moment(employee.dob).unix(),
      Nationality: employee.nationality as mangopay.CountryISO,
      CountryOfResidence: "GB",
      Email: employee.email,
      PersonType: Natural,
    })

    const { Id: newWalletId } = await mango.Wallets.create({
      Owners: [newMangoUserId],
      Description: `Employee wallet - ${employee.firstName} ${employee.lastName} - mangoID: ${newMangoUserId}`,
      Currency: GBP,
    })

    const platformFees = calculatePlatformFees({
      minimumLoanFee: employee.employer.minimumLoanFee,
      loanAmount: employee.loan.amount,
    })

    const {
      Id: payInId,
      BankAccount,
      WireReference,
    } = await mango.PayIns.create({
      PaymentType: "BANK_WIRE",
      ExecutionType: "DIRECT",
      AuthorId: newMangoUserId,
      CreditedUserId: newMangoUserId,
      CreditedWalletId: newWalletId,
      DeclaredDebitedFunds: {
        Currency: GBP,
        Amount: employee.loan.amount + platformFees,
      },
      DeclaredFees: {
        Currency: GBP,
        Amount: platformFees,
      },
    })

    await prisma.updateUser({
      data: {
        mangoWalletId: newWalletId,
        mangoUserId: newMangoUserId,
        payIns: {
          create: [
            {
              employer: { connect: { id: employee.employer.id } },
              mangoPayInId: payInId,
            },
          ],
        },
      },
      where: {
        email: employee.email,
      },
    })

    const [sortCode, accountNumber] = R.splitAt(-8, BankAccount.IBAN)

    // TODO: check this in production to see if it's being split properly
    sendLoanTransferDetails({
      email: "ivan@infactcoop.com",
      sortCode,
      accountNumber,
      bankOwnerName: BankAccount.OwnerName,
      WireReference,
      loanAmount: employee.loan.amount,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      fees: `${platformFees / 1.2}`,
      feesPlusVAT: `${platformFees}`,
      totalPayInAmount: employee.loan.amount + platformFees,
    })
    console.log("Success!")
  } catch (err) {
    console.error(err)
  }
}

run()
