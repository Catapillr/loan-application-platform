import { useState } from 'react'
import nextCookies from 'next-cookies'
import styled from 'styled-components'
import * as R from 'ramda'
import axios from 'axios'

import { ADD_CLUB_TO_ACCOUNT } from '../utils/constants'

import restrictAccess from '../utils/restrictAccess'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ClubContainer from '../components/Club'
import ErrorBoundary from '../components/ErrorBoundary'

const SchoolHolidayClubs = ({ clubsByLocation = {}, user }) => {
  const [clubs, setClubs] = useState(clubsByLocation)

  const updateClubs = companyNumber =>
    R.pipe(
      R.map(location =>
        R.map(club =>
          companyNumber === club.companyNumber
            ? { ...club, addedByUser: [{ email: user.email }] }
            : club,
        )(location),
      ),
      setClubs,
    )(clubs)

  const ClubsByLocations = () =>
    R.pipe(
      R.mapObjIndexed((location, locationName) => (
        <ClubContainer
          key={`club-${locationName}`}
          title={locationName}
          updateClubs={updateClubs}
          schoolHolidayClubs={location}
          buttonAction={ADD_CLUB_TO_ACCOUNT}
        />
      )),
      R.values,
    )(clubs)

  return (
    <Container>
      <Header />
      <ErrorBoundary shadowed>
        <Contents>
          <Main>
            <Title className="mb-12">Select a school holiday provider</Title>
            <ClubsByLocations />
          </Main>
          <Aside>
            <Tip className="mb-6">
              <h2 className="font-bold mb-6">How does this work?</h2>
              <p className="mb-6">
                In this section you can view a number of school holiday
                clubs/providers* and pick the best one that suits your needs.
              </p>
              <p className="mb-6">
                Then, simply add the provider to your account and you can pay
                for the childcare you need.
              </p>
            </Tip>
            <p className="w-8/12 mb-6">
              Can’t find a local club? Send us an{' '}
              <Link href={`mailto:${process.env.SUPPORT_EMAIL}`}>email</Link> or
              visit the{' '}
              <Link href="https://www.gov.uk/after-school-holiday-club">
                Goverment website
              </Link>
            </p>
            <p className="w-8/12 font-xs">
              * <span className="text-red underline">Note:</span> Catapillr is
              not responsible for the content on third-party websites.
            </p>
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
      data: { clubsByLocation },
    } = await axios(`${process.env.HOST}/api/private/get-clubs-by-location`, {
      headers: { Cookie: serializedCookies },
    })

    return { user, clubsByLocation }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error in /school-holiday-clubs getInitProps: ', err)
    return {}
  }
}

const Aside = styled.aside.attrs({
  className: 'w-5/12 flex flex-col items-center',
})``

const Container = styled.div.attrs({
  className: 'w-full bg-lightgray min-h-screen flex flex-col justify-between',
})``

const Contents = styled.section.attrs({
  className: 'flex flex-grow justify-between pl-43 pr-12 py-18 h-full',
})``

const Link = styled.a.attrs({
  className: 'underline text-teal db mb-3d5',
})``

const Main = styled.section.attrs({
  className: 'w-6/12',
})``

const Tip = styled.aside.attrs({
  className: 'bg-white py-10 px-9 w-8/12 mt-27',
})`
  height: fit-content;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const Title = styled.h1.attrs({
  className: 'font-bold font-3xl',
})``

export default SchoolHolidayClubs
