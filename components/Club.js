import React, { useState } from 'react'
import * as R from 'ramda'
import styled from 'styled-components'
import axios from 'axios'

import {
  REQUEST_NOT_SENT,
  REQUEST_SENDING,
  REQUEST_FAILED,
  REQUEST_SUCCESSFUL,
  PAY_CLUB,
} from '../utils/constants'

import R_ from '../utils/R_'

import ErrorBoundary from './ErrorBoundary'
import {
  TileContainer,
  TileGrid,
  Button,
  LinkButton,
  Tile,
  Icon,
  Name,
  Link,
  Subtitle,
} from './Tile'

const AddClubButton = ({ status, setStatus, companyNumber, updateClubs }) => (
  <Button
    className={
      status === REQUEST_SENDING || status === REQUEST_SUCCESSFUL
        ? 'pointer-events-none'
        : 'pointer-events-auto'
    }
    onClick={async () => {
      setStatus(REQUEST_SENDING)
      const newStatus = await addClubToUser(companyNumber)

      if (newStatus === REQUEST_SUCCESSFUL) updateClubs(companyNumber)
      return setStatus(newStatus)
    }}
  >
    {buttonText(status)}
  </Button>
)

const PayClubButton = ({ companyNumber }) => (
  <LinkButton href={`${process.env.HOST}/make-a-payment/${companyNumber}`}>
    Pay
  </LinkButton>
)

const addClubToUser = async companyNumber => {
  try {
    const {
      data: { response },
    } = await axios.post(`${process.env.HOST}/api/private/add-club-to-user`, {
      companyNumber,
    })
    return response
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error in addClubToUser POST request', e)
    return REQUEST_FAILED
  }
}

const buttonText = status => {
  switch (status) {
    case REQUEST_NOT_SENT:
      return 'Add to account'
    case REQUEST_SENDING:
      return 'Loading...'
    case REQUEST_SUCCESSFUL:
      return 'Added'
    case REQUEST_FAILED:
      return 'Retry?'
  }
}

const Club = ({
  companyName,
  companyNumber,
  websiteURL,
  imgURL,
  buttonAction,
  addedByUser,
  updateClubs,
}) => {
  const [status, setStatus] = useState(
    R.isEmpty(addedByUser) ? REQUEST_NOT_SENT : REQUEST_SUCCESSFUL,
  )

  return (
    <Tile>
      <ClubIcon src={imgURL} />
      <Name>{companyName}</Name>
      <Link href={websiteURL}>Go to website</Link>
      {buttonAction === PAY_CLUB ? (
        <PayClubButton companyNumber={companyNumber} />
      ) : (
        <AddClubButton {...{ status, setStatus, companyNumber, updateClubs }} />
      )}
    </Tile>
  )
}

const ClubContainer = ({
  title,
  schoolHolidayClubs = {},
  updateClubs,
  buttonAction,
}) => {
  return (
    <TileContainer>
      <Subtitle className="mb-10">{title}</Subtitle>
      <ErrorBoundary shadowed>
        <TileGrid>
          {R_.mapIndexed((club, i) => (
            <Club
              key={`club-${i}`}
              buttonAction={buttonAction}
              updateClubs={updateClubs}
              {...club}
            />
          ))(schoolHolidayClubs)}
        </TileGrid>
      </ErrorBoundary>
    </TileContainer>
  )
}

const ClubIcon = styled(Icon).attrs({
  className: 'w-full h-12 mb-2',
})`
  background-size: contain;
  background-repeat: no-repeat;
`

export default ClubContainer
