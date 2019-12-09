import { prisma } from "../generated/ts"
import mango from "../../lib/mango"
import moment from "moment"
import mangopay from "mangopay2-nodejs-sdk"
import R from "ramda"
import { sendLoanTransferDetails } from "../../utils/mailgunClient"
import gql from "graphql-tag"
import calculatePlatformFees from "../../utils/calculatePlatformFees"

const Natural = "NATURAL"
const GBP = "GBP"

const run = async (): Promise<any> => {
  try {
    await prisma.deleteUser({ email: "ivan@infactcoop.com" })

    const loanAmount = 400000
    const platformFees = calculatePlatformFees({
      loanAmount,
      minimumLoanFee: 20000,
    })

    const ivan: any = await prisma.createUser({
      firstName: "Ivan",
      lastName: "Gonzalez",
      email: "ivan@infactcoop.com",
      phoneNumber: "+447939656400",
      dob: new Date().toISOString(),
      nationality: "GB",
      employmentStartDate: new Date().toISOString(),
      annualSalary: 4000000,
      employer: { connect: { slug: "infact" } },
      loan: {
        create: {
          amount: loanAmount,
          terms: 7,
          approved: true,
          platformFees,
        },
      },
      gdprConsent: true,
    }).$fragment(gql`
      fragment EmployeeWithLoanPlayground on User {
        firstName
        lastName
        email
        dob
        nationality
        loan {
          amount
          platformFees
        }
        employer {
          id
          minimumLoanFee
        }
      }
    `)

    const { Id: newMangoUserId } = await mango.Users.create({
      FirstName: ivan.firstName,
      LastName: ivan.lastName,
      Birthday: moment.utc(ivan.dob).unix(),
      Nationality: ivan.nationality as mangopay.CountryISO,
      CountryOfResidence: "GB",
      Email: ivan.email,
      PersonType: Natural,
    })

    const { Id: newWalletId } = await mango.Wallets.create({
      Owners: [newMangoUserId],
      Description: `Employee wallet - ${ivan.firstName} ${ivan.lastName} - mangoID: ${newMangoUserId}`,
      Currency: GBP,
    })

    const {
      Id: payInId,
      WireReference,
      BankAccount,
    } = await mango.PayIns.create({
      PaymentType: "BANK_WIRE",
      ExecutionType: "DIRECT",
      AuthorId: newMangoUserId,
      CreditedUserId: newMangoUserId,
      CreditedWalletId: newWalletId,
      DeclaredDebitedFunds: {
        Currency: GBP,
        Amount: ivan.loan.amount + ivan.loan.platformFees,
      },
      DeclaredFees: {
        Currency: GBP,
        Amount: ivan.loan.platformFees,
      },
    })

    await prisma.updateUser({
      data: {
        mangoWalletId: newWalletId,
        mangoUserId: newMangoUserId,
        payIns: {
          create: [
            {
              employer: { connect: { id: ivan.employer.id } },
              mangoPayInId: payInId,
            },
          ],
        },
        loan: {
          update: {
            approved: true,
          },
        },
      },
      where: {
        email: ivan.email,
      },
    })

    const [sortCode, accountNumber] = R.splitAt(-8, BankAccount.IBAN)

    // TODO: check this in production to see if it's being split properly
    sendLoanTransferDetails({
      email: "hello@infactcoop.com",
      sortCode,
      accountNumber,
      bankOwnerName: BankAccount.OwnerName,
      WireReference,
      loanAmount: ivan.loan.amount,
      employeeName: `${ivan.firstName} ${ivan.lastName}`,
      fees: `${ivan.loan.platformFees / 1.2}`,
      feesPlusVAT: ivan.loan.platformFees,
      totalPayInAmount: ivan.loan.amount + ivan.loan.platformFees,
    })
    // eslint-disable-next-line
    console.log("Success!")
  } catch (err) {
    // eslint-disable-next-line
    console.error(err)
  }
}

run()
