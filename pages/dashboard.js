import styled from 'styled-components'
import restrictAccess from '../utils/restrictAccess'
import axios from 'axios'

import nextCookies from 'next-cookies'
import * as R from 'ramda'
import * as moment from 'moment'
import currencyFormatter from 'currency-formatter'

// import { NURSERY, CLUB } from "../utils/constants"

import Header from '../components/Header'
import Footer from '../components/Footer'
import Transaction from '../components/Transaction'
import PayeeContainer from '../components/Payee'
import ClubContainer from '../components/Club'
import penniesToPounds from '../utils/penniesToPounds'
import ErrorBoundary from '../components/ErrorBoundary'
import { PAY_CLUB } from '../utils/constants'

const Transfer = 'TRANSFER'
const PayIn = 'PAYIN'

const Dash = ({
  transactions = [],
  userWalletBalance,
  recentPayeesByMangoId = {},
  clubsByUser = [],
}) => {
  return (
    <Container>
      <Header />
      <ErrorBoundary shadowed>
        <Contents>
          <Main>
            <Title className="mb-12">My payments</Title>

            <PayeeContainer
              title="Recent payees"
              payees={recentPayeesByMangoId}
            />

            <ClubContainer
              title="Holiday clubs"
              schoolHolidayClubs={clubsByUser}
              buttonAction={PAY_CLUB}
            />
          </Main>
          <Aside>
            <BalanceContainer>
              <Subtitle>Balance</Subtitle>
              <Title>{formatAmounts(userWalletBalance)}</Title>
            </BalanceContainer>

            <ErrorBoundary>
              <TransactionContainer>
                <Subtitle className="mb-10">My transactions</Subtitle>

                {// eslint-disable-next-line array-callback-return
                transactions.map(transaction => {
                  switch (transaction.Type) {
                    case Transfer:
                      return (
                        <Transaction
                          key={transaction.Id}
                          name={
                            recentPayeesByMangoId[transaction.CreditedUserId]
                              .Name
                          }
                          amount={`-${formatAmounts(
                            transaction.DebitedFunds.Amount,
                          )}`}
                          date={moment
                            .unix(transaction.ExecutionDate) // eslint-disable-line import/namespace
                            .format('D MMMM YYYY')}
                        />
                      )
                    case PayIn:
                      return (
                        <Transaction
                          key={transaction.Id}
                          name={transaction.debitedUserName}
                          amount={`+${formatAmounts(
                            transaction.CreditedFunds.Amount,
                          )}`}
                          date={moment
                            .unix(transaction.ExecutionDate) // eslint-disable-line import/namespace
                            .format('D MMMM YYYY')}
                        />
                      )
                    default:
                      return <div key={transaction.Id}></div>
                  }
                })}
              </TransactionContainer>
            </ErrorBoundary>
          </Aside>
        </Contents>
      </ErrorBoundary>
      <Footer />
    </Container>
  )
}
Dash.getInitialProps = async ctx => {
  const { req } = ctx

  if (restrictAccess(ctx)) {
    return
  }

  const cookies = nextCookies(ctx)
  const serializedCookies = R.pipe(
    R.mapObjIndexed((val, key) => `${key}=${val};`),
    R.values,
    R.join(' '),
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
      {
        data: { clubsByUser },
      },
    ] = await Promise.all([
      axios.get(
        `${process.env.HOST}/api/private/list-user-transactions?mangoId=${user.mangoUserId}`,
        {
          headers: { Cookie: serializedCookies },
        },
      ),
      axios.get(`${process.env.HOST}/api/private/get-user-wallet-balance`, {
        headers: { Cookie: serializedCookies },
      }),
      axios.get(`${process.env.HOST}/api/private/get-clubs-by-user`, {
        headers: { Cookie: serializedCookies },
      }),
    ])

    return {
      user,
      transactions,
      userWalletBalance,
      recentPayeesByMangoId,
      clubsByUser,
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error in dashboard getInitProps: ', err)
    return {}
  }
}

const formatAmounts = R.pipe(
  penniesToPounds,
  R.flip(currencyFormatter.format)({ code: 'GBP' }),
)

const Container = styled.div.attrs({
  className: 'w-full bg-lightgray min-h-screen flex flex-col justify-between',
})``

const Contents = styled.section.attrs({
  className: 'flex flex-grow justify-between pl-43 pr-12 py-18 h-full',
})``

const Main = styled.main.attrs({
  className: 'w-6/12',
})``

const Aside = styled.aside.attrs({
  className: 'bg-white w-5/12',
})`
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const BalanceContainer = styled.div.attrs({
  className: 'bg-teal text-white flex items-center justify-between px-9 py-5d5',
})``

const Subtitle = styled.h2.attrs({
  className: 'font-2xl font-bold',
})``

const Title = styled.h1.attrs({
  className: 'font-bold font-3xl',
})``

const TransactionContainer = styled.section.attrs({
  className: 'px-9 py-10d5',
})``

export default Dash
