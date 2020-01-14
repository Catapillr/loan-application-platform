import nextCookies from 'next-cookies'
import styled from 'styled-components'
import * as R from 'ramda'
import axios from 'axios'

// import { NURSERY, CLUB } from "../utils/constants"
import restrictAccess from '../utils/restrictAccess'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Payee from '../components/Payee'
import ErrorBoundary from '../components/ErrorBoundary'

const SchoolHolidayClubs = ({ recentPayeesByMangoId }) => {
  return (
    <Container>
      <Header />
      <ErrorBoundary shadowed>
        <Contents>
          <Main>
            <Title className="mb-12">Select a school holiday provider</Title>

            <Subtitle className="mb-10">Nationwide</Subtitle>
            <ErrorBoundary shadowed>
              <PayeesContainer>
                {R.values(recentPayeesByMangoId)
                  .filter(
                    ({ Id }) => Id !== process.env.TAX_FREE_ACCOUNT_USER_ID,
                  )
                  .map(payee => (
                    <Payee
                      name={payee.Name}
                      key={payee.Id}
                      href={`${process.env.HOST}/make-a-payment/${payee.CompanyNumber}`}
                    />
                  ))}
              </PayeesContainer>
            </ErrorBoundary>
          </Main>
          <Aside>
            <Tip>
              <h2 className="font-bold mb-6">How does this work?</h2>
              <p className="mb-6">
                Search for your childcare provider by entering their name or
                company number into the search bar (left).
              </p>
              <p className="mb-6">
                Select the provider from the list. In case your provider doesnt
                show up, add them by sending them an email letting know that you
                would like to use their services through the catapillr scheme.
              </p>
              <p>
                Can't find who you want to pay?{' '}
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
      </ErrorBoundary>
      <Footer />
    </Container>
  )
}

SchoolHolidayClubs.getInitialProps = async ctx => {
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

    const {
      data: { recentPayeesByMangoId },
    } = await axios(
      `${process.env.HOST}/api/private/list-user-transactions?mangoId=${user.mangoUserId}`,
      {
        headers: { Cookie: serializedCookies },
      },
    )
    return { user, recentPayeesByMangoId }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error in make-a-payment getInitProps: ', err)
    return {}
  }
}

const Container = styled.div.attrs({
  className: 'w-full bg-lightgray min-h-screen flex flex-col justify-between',
})``

const Contents = styled.section.attrs({
  className: 'flex flex-grow justify-between pl-43 pr-12 py-18 h-full',
})``
const Main = styled.section.attrs({
  className: 'w-6/12',
})``

const Aside = styled.aside.attrs({
  className: 'w-5/12 flex justify-center',
})``

const Tip = styled.aside.attrs({
  className: 'bg-white py-10 px-9 w-8/12 mt-27',
})`
  height: fit-content;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const Subtitle = styled.h2.attrs({
  className: 'font-2xl font-bold',
})``

const Title = styled.h1.attrs({
  className: 'font-bold font-3xl',
})``

const PayeesContainer = styled.section.attrs({
  className: '',
})`
  display: grid;
  grid-column-gap: ${cssTheme('spacing.5')};
  grid-row-gap: ${cssTheme('spacing.5')};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
`

export default SchoolHolidayClubs
