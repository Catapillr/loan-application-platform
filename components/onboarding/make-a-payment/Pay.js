import * as Yup from "yup"
import styled from "styled-components"

const Container = styled.section.attrs({
  className: "w-full block bg-white px-10 pb-10 pt-6",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Title = styled.label.attrs({
  className: "mb-5 block ttu font-bold",
})``

const validation = Yup.object().shape({
  company: Yup.object().required("Required"),
})

const Pay = ({ company }) => (
  <Container>
    <Title>{company.company_number}</Title>
  </Container>
)

Pay.validationSchema = validation
Pay.componentName = "Pay"

export default Pay
