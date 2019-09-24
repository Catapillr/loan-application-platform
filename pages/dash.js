// import Link from "next/link"
import styled from "styled-components"

import { NURSERY, CLUB } from "../components/constants"

import Header from "../components/Header"
import Footer from "../components/Footer"
import Transaction from "../components/Transaction"
import Payee from "../components/Payee"
// import axios from "axios"
// import nextCookies from "next-cookies"
// import * as R from "ramda"

// import restrictAccess from "../utils/restrictAccess"

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

const Dash = () => (
  <Container>
    <Header />
    <Contents>
      <Main>
        <Title className="mb-12">My payments</Title>
        <Subtitle className="mb-10">Recent payees</Subtitle>
        <PayeesContainer>
          <Payee name="True Colours Nursery" childcareType={NURSERY} slug="" />
          <Payee name="Rocky Climbing Wall" childcareType={CLUB} slug="" />
          <Payee name="Clapton FC" childcareType={CLUB} slug="" />
          <Payee name="True Colours Nursery" childcareType={NURSERY} slug="" />
          <Payee name="Rocky Climbing Wall" childcareType={CLUB} slug="" />
        </PayeesContainer>
      </Main>
      <Aside>
        <BalanceContainer>
          <Subtitle>Balance</Subtitle>
          <Title>£1,700</Title>
        </BalanceContainer>
        <TransactionContainer>
          <Subtitle className="mb-10">My transactions</Subtitle>
          <Transaction
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
          />
        </TransactionContainer>
      </Aside>
    </Contents>
    <Footer />
  </Container>
)

Dash.getInitialProps = async ctx => {
  const { req } = ctx
  // makes sure session is authenticated and that page is server side rendered
  // (auth does not work at the moment without SSR)
  // restrictAccess(ctx)

  // we need this when the axios request gets sent from the server rather than the browser
  // as the session cookies are not passed along to axios from the req object. This is not
  // a problem on the browser as cookies are added to every request automatically
  // const cookies = nextCookies(ctx)
  // const serializedCookies = R.pipe(
  //   R.mapObjIndexed((val, key) => `${key}=${val};`),
  //   R.values,
  //   R.join(" ")
  // )(cookies)

  try {
    // const {
    //   data: { allEmployers },
    // } = await axios.get(`${process.env.HOST}/api/test`, {
    //   headers: { Cookie: serializedCookies },
    // })

    // this user gets added by passport on all authenticated requests
    const user = req.user

    return { user }
  } catch (err) {
    console.error("Error in dash getInitProps: ", err) //eslint-disable-line
    return {}
  }
}

export default Dash
