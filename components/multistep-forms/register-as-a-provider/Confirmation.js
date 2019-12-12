import styled from 'styled-components'

import { Heading } from '../styles'

import providerProgressComplete from '../../../static/images/providerProgressComplete.svg'

const Container = styled.div`
  min-height: 80%;
`

const Confirmation = () => {
  return (
    <Container>
      <Heading className="mb-3">Great!</Heading>
      <Heading className="mb-5">Your application has been sent off.</Heading>
      <p>
        You will receive an email notifying you of the status of your
        application. When it is approved, your payment will automatically be
        processed!
      </p>
    </Container>
  )
}

Confirmation.hideNext = true
Confirmation.hidePrevious = true
Confirmation.progressImg = providerProgressComplete
Confirmation.componentName = 'Confirmation'

export default Confirmation
