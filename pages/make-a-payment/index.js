import { useState, useEffect } from "react"
import nextCookies from "next-cookies"
import styled from "styled-components"
import * as R from "ramda"
import axios from "axios"

// import { NURSERY, CLUB } from "../../utils/constants"
import restrictAccess from "../../utils/restrictAccess"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Payee from "../../components/Payee"

const MakeAPayment = ({ recentPayeesByMangoId }) => (
  <Container>
    <Header activeHref="/make-a-payment" />
    <Contents>
      <Main>
        <Title className="mb-12">Make a payment</Title>

        <SearchContainer>
          <SearchTitle>Find your service provider</SearchTitle>
          <Search />
        </SearchContainer>
        <Subtitle className="mb-10">Recent payees</Subtitle>
        <PayeesContainer>
          {R.values(recentPayeesByMangoId).map(payee => (
            <Payee
              name={payee.Name}
              key={payee.Id}
              href={`${process.env.HOST}/make-a-payment/${payee.companyNumber}`}
            />
          ))}
        </PayeesContainer>
      </Main>
      <Aside>
        <Tip>
          <h2 className="font-bold mb-6">How does this work?</h2>
          <p className="mb-6">
            Search for your childcare provider by entering their name or company
            number into the search bar (left).
          </p>
          <p className="mb-6">
            Select the provider from the list. In case your provider doesnt show
            up, add them by sending them an email letting know that you would
            like to use their services through the catapillr scheme.
          </p>
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

MakeAPayment.getInitialProps = async ctx => {
  const { req } = ctx

  if (restrictAccess(ctx)) {
    return
  }

  const cookies = nextCookies(ctx)
  const serializedCookies = R.pipe(
    R.mapObjIndexed((val, key) => `${key}=${val};`),
    R.values,
    R.join(" ")
  )(cookies)

  try {
    const user = req.user

    const {
      data: { recentPayeesByMangoId },
    } = await axios(
      `${process.env.HOST}/api/private/list-user-transactions?mangoId=${user.mangoUserId}`,
      {
        headers: { Cookie: serializedCookies },
      }
    )
    return { user, recentPayeesByMangoId }
  } catch (err) {
    // eslint-disable-next-line
    console.error("Error in make-a-payment getInitProps: ", err)
    return {}
  }
}

const Company = ({ title, company_number, address_snippet }) => (
  <a
    href={`${process.env.HOST}/make-a-payment/${company_number}`}
    key={company_number}
  >
    <_Company>
      <p className="text-bold font-bold">{title}</p>
      <p>{company_number}</p>
      <p>{address_snippet}</p>
    </_Company>
  </a>
)

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const getCompanies = async () => {
      const {
        data: { companies },
      } = await axios(`${process.env.HOST}/api/get-companies?q=${searchTerm}`)

      setCompanies(companies)
    }
    getCompanies()
  }, [searchTerm])

  const onChange = ({ target: { value } }) => {
    setSearchTerm(value)
  }

  return (
    <div className="mb-10">
      <_Search
        value={searchTerm}
        placeholder="Enter company name and postcode or company number…"
        onChange={onChange}
        className="mb-5"
      />
      {!R.isEmpty(companies) && (
        <CompaniesList>{R.map(Company)(companies)}</CompaniesList>
      )}
    </div>
  )
}

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
  className: "",
})`
  display: grid;
  grid-column-gap: ${cssTheme("spacing.5")};
  grid-row-gap: ${cssTheme("spacing.5")};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
`

const SearchContainer = styled.section.attrs({
  className: "w-full block",
})``

const SearchTitle = styled.label.attrs({
  className: "mb-5 block",
})``

const _Search = styled.input.attrs({
  className:
    "border-2 w-full bg-lightgray block border-midgray rounded-full py-3 pl-6 pr-7",
})``

const CompaniesList = styled.ul.attrs({
  className: "bg-white pt-1d5 pb-4d5 px-1",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const _Company = styled.li.attrs({
  className: "py-4d5 pl-5d5 pr-12 cursor-pointer",
})`
  &:hover {
    background-color: #f3fbfc;
  }

  &:active {
    background-color: #d0f2f5;
  }
`

export default MakeAPayment
