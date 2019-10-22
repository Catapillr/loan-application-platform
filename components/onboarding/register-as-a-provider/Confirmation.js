import styled from "styled-components"

import { Heading } from "../styles"

import providerProgressComplete from "../../../static/images/providerProgressComplete.svg"

const Container = styled.div`
  min-height: 80%;
`

const Confirmation = () => {
  return (
    <Container>
      <Heading className="mb-3">Great!</Heading>
      <Heading className="mb-5">
        Your loan agreement has been generated and sent to your email.
      </Heading>
      <p>
        Please check and sign the loan agreement. You will then receive an email
        with further instructions.
      </p>
    </Container>
  )
}

Confirmation.hideNext = true
Confirmation.hidePrevious = true
Confirmation.progressImg = providerProgressComplete
Confirmation.componentName = "Confirmation"

export default Confirmation
