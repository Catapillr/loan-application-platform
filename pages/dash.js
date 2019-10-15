import styled from "styled-components"
import restrictAccess from "../utils/restrictAccess"
import axios from "axios"
import nextCookies from "next-cookies"
import * as R from "ramda"
import * as moment from "moment"
import currencyFormatter from "currency-formatter"

import { NURSERY, CLUB } from "../utils/constants"

import Header from "../components/Header"
import Footer from "../components/Footer"
import Transaction from "../components/Transaction"
import Payee from "../components/Payee"

const Transfer = "TRANSFER"
const PayIn = "PAYIN"

const Container = styled.div.attrs({
  className: "w-full bg-lightgray min-h-screen flex flex-col justify-between",
})``

const Contents = styled.section.attrs({
  className: "flex flex-grow justify-between pl-43 pr-12 py-18 h-full",
})``
const Main = styled.main.attrs({
  className: "w-6/12",
})``

const Aside = styled.aside.attrs({
  className: "bg-white w-5/12",
})`
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const BalanceContainer = styled.div.attrs({
  className: "bg-teal text-white flex items-center justify-between px-9 py-5d5",
})``

const Subtitle = styled.h2.attrs({
  className: "font-2xl font-bold",
})``

const Title = styled.h1.attrs({
  className: "font-bold font-3xl",
})``

const TransactionContainer = styled.section.attrs({
  className: "px-9 py-10d5",
})``

const PayeesContainer = styled.section.attrs({
  className: "",
})`
  display: grid;
  grid-column-gap: ${cssTheme("spacing.5")};
  grid-row-gap: ${cssTheme("spacing.5")};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
`

const formatAmounts = R.pipe(
  amount => amount / 100,
  R.flip(currencyFormatter.format)({ code: "GBP" })
)

const Dash = ({ transactions, userWalletBalance, recentPayeesByMangoId }) => (
  <Container>
    <Header activeHref="/dash" />
    <Contents>
      <Main>
        <Title className="mb-12">My payments</Title>
        <Subtitle className="mb-10">Recent payees</Subtitle>
        <PayeesContainer>
          {R.values(recentPayeesByMangoId).map(payee => (
            <Payee
              name={payee.Name}
              key={payee.Name}
              slug={payee.CompanyNumber}
            />
          ))}
          {/* <Payee name="True Colours Nursery" childcareType={NURSERY} slug="" />
          <Payee name="Rocky Climbing Wall" childcareType={CLUB} slug="" />
          <Payee name="Clapton FC" childcareType={CLUB} slug="" />
          <Payee name="True Colours Nursery" childcareType={NURSERY} slug="" />
          <Payee name="Rocky Climbing Wall" childcareType={CLUB} slug="" /> */}
        </PayeesContainer>
      </Main>
      <Aside>
        <BalanceContainer>
          <Subtitle>Balance</Subtitle>
          <Title>{formatAmounts(userWalletBalance)}</Title>
        </BalanceContainer>
        <TransactionContainer>
          <Subtitle className="mb-10">My transactions</Subtitle>

          {//eslint-disable-next-line array-callback-return
          transactions.map(transaction => {
            switch (transaction.Type) {
              case Transfer:
                return (
                  <Transaction
                    key={transaction.Id}
                    name={
                      recentPayeesByMangoId[transaction.CreditedUserId].Name
                    }
                    amount={`-${formatAmounts(
                      transaction.DebitedFunds.Amount
                    )}`}
                    date={moment
                      .unix(transaction.ExecutionDate) //eslint-disable-line import/namespace
                      .format("D MMMM YYYY")}
                  />
                )
              // case PayIn:
              //   return (
              //     <Transaction
              //       key={transaction.Id}
              //       name={
              //         recentPayeesByMangoId[transaction.CreditedUserId].Name
              //       }
              //       amount={`+${formatAmounts(
              //         transaction.DebitedFunds.Amount
              //       )}`}
              //       date={moment
              //         .unix(transaction.ExecutionDate) //eslint-disable-line import/namespace
              //         .format("D MMMM YYYY")}
              //     />
              //   )
              default:
                return <div></div>
            }
          })}
          {/* <Transaction
            name="True Colours Nursery"
            amount="-£400"
            date="12 July 2019"
          />
          <Transaction
            name="Rocky Climbing Wall"
            amount="-£200"
            date="10 June 2019"
          />
          <Transaction name="Clapton FC" amount="-£500" date="1 May 2019" />
          <Transaction
            name="InFact Digital Co-op"
            amount="+£3,000"
            date="20 March 2019"
          /> */}
        </TransactionContainer>
      </Aside>
    </Contents>

    <pre>{JSON.stringify(recentPayeesByMangoId, undefined, 2)}</pre>
    <pre>{JSON.stringify(transactions, undefined, 2)}</pre>

    <Footer />
  </Container>
)

// { Id: '69682592',
//     Tag: null,
//     CreationDate: 1570546169,
//     AuthorId: '68516446',
//     CreditedUserId: '69681155',
//     DebitedFunds: { Currency: 'GBP', Amount: 11000 },
//     CreditedFunds: { Currency: 'GBP', Amount: 11000 },
//     Fees: { Currency: 'GBP', Amount: 0 },
//     Status: 'SUCCEEDED',
//     ResultCode: '000000',
//     ResultMessage: 'Success',
//     ExecutionDate: 1570546169,
//     Type: 'TRANSFER',
//     Nature: 'REGULAR',
//     CreditedWalletId: '69681266',
//     DebitedWalletId: '68516447',
//     creditedUser:
//      { HeadquartersAddress: [Object],
//        LegalRepresentativeAddress: [Object],
//        Name: 'InFact',
//        LegalPersonType: 'BUSINESS',
//        LegalRepresentativeFirstName: 'Maximus',
//        LegalRepresentativeLastName: 'Gerber',
//        LegalRepresentativeEmail: null,
//        LegalRepresentativeBirthday: 1463496101,
//        LegalRepresentativeNationality: 'GB',
//        LegalRepresentativeCountryOfResidence: 'GB',
//        ProofOfRegistration: null,
//        ShareholderDeclaration: null,
//        Statute: null,
//        LegalRepresentativeProofOfIdentity: null,
//        CompanyNumber: 'LU72HN11',
//        PersonType: 'LEGAL',
//        Email: 'hello@infactcoop.com',
//        KYCLevel: 'LIGHT',
//        Id: '69681155',
//        Tag: null,
//        CreationDate: 1570544640 } },

Dash.getInitialProps = async ctx => {
  const { req } = ctx
  restrictAccess(ctx)

  const cookies = nextCookies(ctx)
  const serializedCookies = R.pipe(
    R.mapObjIndexed((val, key) => `${key}=${val};`),
    R.values,
    R.join(" ")
  )(cookies)

  try {
    const user = req.user

    const [
      {
        data: { transactions, recentPayeesByMangoId },
      },

      {
        data: { userWalletBalance },
      },
    ] = await Promise.all([
      axios.get(
        `${process.env.HOST}/api/list-user-transactions?mangoId=${user.mangoUserId}`,
        {
          headers: { Cookie: serializedCookies },
        }
      ),
      axios.get(`${process.env.HOST}/api/private/get-user-wallet-balance`, {
        headers: { Cookie: serializedCookies },
      }),
    ])

    return { user, transactions, userWalletBalance, recentPayeesByMangoId }
  } catch (err) {
    // eslint-disable-next-line
    console.error("Error in dashboard getInitProps: ", err)
    return {}
  }
}

export default Dash
