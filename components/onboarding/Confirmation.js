import styled from "styled-components"

import { Heading } from "./styles"

import progress5 from "../../static/images/progress5.svg"
import { Confirmation } from "./constants"

const Container = styled.div`
  min-height: 80%;
`

const Step9 = () => {
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

Step9.hideNext = true
Step9.hidePrevious = true
Step9.progressImg = progress5
Step9.title = Confirmation

export default Step9
