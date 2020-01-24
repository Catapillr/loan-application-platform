import React from 'react'
import * as R from 'ramda'
import styled from 'styled-components'
import { NURSERY, CHILDMINDER, CLUB } from '../utils/constants'

import {
  Tile,
  Subtitle,
  TileContainer,
  TileGrid,
  Icon,
  LinkButton,
} from './Tile'
import ErrorBoundary from './ErrorBoundary'

import nursery from '../static/icons/nursery.svg'
import childminder from '../static/icons/childminder.svg'
import club from '../static/icons/club.svg'

const childcareToIcon = childcareType => {
  switch (childcareType) {
    case NURSERY:
      return nursery
    case CHILDMINDER:
      return childminder
    case CLUB:
      return club
    default:
      return nursery
  }
}

const Payee = ({ name, childcareType, href }) => (
  <Tile>
    <PayeeIcon src={childcareToIcon(childcareType)} />
    <Name>{name}</Name>
    <LinkButton href={href}>Pay</LinkButton>
  </Tile>
)

const PayeeContainer = ({ title, payees = {} }) => (
  <TileContainer>
    <Subtitle className="mb-10">{title}</Subtitle>
    <ErrorBoundary shadowed>
      <TileGrid>
        {R.values(payees)
          .filter(({ Id }) => Id !== process.env.TAX_FREE_ACCOUNT_USER_ID)
          .map(payee => (
            <Payee
              name={payee.Name}
              key={payee.Id}
              href={`${process.env.HOST}/make-a-payment/${payee.CompanyNumber}`}
            />
          ))}
      </TileGrid>
    </ErrorBoundary>
  </TileContainer>
)

const TFCPayeeContainer = ({ childAccounts = [] }) => {
  if (R.isEmpty(childAccounts)) return null

  return (
    <TileContainer>
      <Subtitle className="mb-10">Your accounts</Subtitle>
      <ErrorBoundary shadowed>
        <TileGrid>
          {R.map(account => (
            <Payee
              name={account.name}
              key={account.name}
              href={`/tax-free-childcare/pay/${account.taxFreeChildReference}?name=${account.name}`}
            />
          ))(childAccounts)}
        </TileGrid>
      </ErrorBoundary>
    </TileContainer>
  )
}

const Name = styled.span.attrs({
  className: 'font-bold w-8/12 mb-2 w-full mb-4d5',
})``

const PayeeIcon = styled(Icon).attrs({
  className: 'w-10 h-10 mb-2',
})``

export { TFCPayeeContainer }
export default PayeeContainer
