import nextCookies from "next-cookies"
import styled from "styled-components"
import * as R from "ramda"
import axios from "axios"

import restrictAccess from "../../../utils/restrictAccess"

import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import Payee from "../../../components/Payee"

// TODO: fix active headers
// TODO: add dropdown to menu

const PayTFC = ({ childAccounts }) => (
  <Container>
    <Header />
    <Contents>
      <Main>
        <Title className="mb-12">Make a payment</Title>

        {!R.isEmpty(childAccounts) && (
          <>
            <Subtitle className="mb-10">Your accounts</Subtitle>
            <PayeesContainer>
              {childAccounts.map(account => (
                <Payee
                  name={account.name}
                  key={account.name}
                  href={`/tax-free-childcare/pay/${account.taxFreeChildReference}?name=${account.name}`}
                />
              ))}
            </PayeesContainer>
          </>
        )}

        <Subtitle className="mb-10">Add an account</Subtitle>
        <PayeesContainer>
          <Tile as="a" href="/tax-free-childcare/add">
            +
          </Tile>
        </PayeesContainer>
      </Main>
      <Aside>
        <Tip>
          <h2 className="font-bold mb-6">How does this work?</h2>
          <p className="mb-6">We need something in here.</p>
          <p className="mb-6">To explain what this does.</p>
          <p>
            Can't find who you want to pay?{" "}
            <a
              className="text-teal underline"
              href="https://catapillr.com/contact-us/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Send us an email now.
            </a>
          </p>
        </Tip>
      </Aside>
    </Contents>
    <Footer />
  </Container>
)

PayTFC.getInitialProps = async ctx => {
  if (restrictAccess(ctx)) {
    return
  }

  try {
    const cookies = nextCookies(ctx)
    const serializedCookies = R.pipe(
      R.mapObjIndexed((val, key) => `${key}=${val};`),
      R.values,
      R.join(" ")
    )(cookies)

    const { data } = await axios.get(
      `${process.env.HOST}/api/private/get-child-accounts`,
      {
        headers: { Cookie: serializedCookies },
      }
    )

    return data
  } catch (err) {
    // eslint-disable-next-line
    console.error("Error in tax free childcare page: ", err)
  }
  //
  //
  // try {
  //   const user = req.user
  //
  //   const {
  //     data: { recentPayeesByMangoId },
  //   } = await axios(
  //     `${process.env.HOST}/api/private/list-user-transactions?mangoId=${user.mangoUserId}`,
  //     {
  //       headers: { Cookie: serializedCookies },
  //     }
  //   )
  //   return { user, recentPayeesByMangoId }
  // } catch (err) {
  //   // eslint-disable-next-line
  //   console.error("Error in make-a-payment getInitProps: ", err)
  //   return {}
  // }
}

const Tile = styled.div.attrs({
  className: "bg-white w-full px-4 py-4 text-center text-gray",
})`
  line-height: normal;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
  font-size: 110px;
  font-weight: 300;
`

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
  className: "w-5/12 flex justify-center",
})``

const Tip = styled.aside.attrs({
  className: "bg-white py-10 px-9 w-8/12 mt-27",
})`
  height: fit-content;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const Subtitle = styled.h2.attrs({
  className: "font-2xl font-bold",
})``

const Title = styled.h1.attrs({
  className: "font-bold font-3xl",
})``

const PayeesContainer = styled.section.attrs({
  className: "mb-10",
})`
  display: grid;
  grid-column-gap: ${cssTheme("spacing.5")};
  grid-row-gap: ${cssTheme("spacing.5")};
  grid-auto-rows: auto;
  grid-template-columns: 1fr 1fr 1fr;
`

export default PayTFC
