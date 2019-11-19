import { prisma } from "../generated/ts"
import mango from "../../lib/mango"
import moment from "moment"
import mangopay from "mangopay2-nodejs-sdk"
import R from "ramda"
import { sendLoanTransferDetails } from "../../utils/mailgunClient"

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
        Amount: employee.loan.amount,
      },
      DeclaredFees: {
        Currency: GBP,
        Amount: 1000,
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
    })
  } catch (err) {
    console.error(err)
  }
}

run()
