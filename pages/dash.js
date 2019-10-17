import styled from "styled-components"
import restrictAccess from "../utils/restrictAccess"
import axios from "axios"
import nextCookies from "next-cookies"
import * as R from "ramda"
import * as moment from "moment"
import currencyFormatter from "currency-formatter"

// import { NURSERY, CLUB } from "../utils/constants"

import Header from "../components/Header"
import Footer from "../components/Footer"
import Transaction from "../components/Transaction"
import Payee from "../components/Payee"
import penniesToPounds from "../utils/penniesToPounds"

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
  penniesToPounds,
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
              key={payee.Id}
              slug={payee.CompanyNumber}
            />
          ))}
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
              case PayIn:
                return (
                  <Transaction
                    key={transaction.Id}
                    name={transaction.debitedUserName}
                    amount={`+${formatAmounts(
                      transaction.CreditedFunds.Amount
                    )}`}
                    date={moment
                      .unix(transaction.ExecutionDate) //eslint-disable-line import/namespace
                      .format("D MMMM YYYY")}
                  />
                )
              default:
                return <div></div>
            }
          })}
        </TransactionContainer>
      </Aside>
    </Contents>
    <Footer />
  </Container>
)

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
