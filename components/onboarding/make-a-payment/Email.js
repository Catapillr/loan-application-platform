import * as Yup from "yup"
import styled from "styled-components"
import { Input, TextInput } from "../../Input"

import Nursery from "../../../static/icons/nursery.svg"

const Container = styled.section.attrs({
  className: "w-full block bg-white px-10 pb-10 pt-6",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Icon = styled.div.attrs({
  className: "w-12 h-12 mb-3 m-auto",
})`
  background-image: url(${Nursery});
`
const Title = styled.label.attrs({
  className: "mb-10 block ttu font-bold text-center font-lg",
})``

const Error = styled.p.attrs({
  className: "text-red my-5d5",
})``

const Copy = styled.p.attrs({
  className: "",
})``
const Next = styled.button.attrs({
  className:
    "text-teal border border-teal rounded-full py-2 px-17 text-center block m-auto",
})``

const validation = Yup.object().shape({
  email: Yup.string()
    .email()
    .required("Required!"),
})

const Email = ({ incrementPage, company, Controls }) => (
  <Container>
    <Controls />
    <Icon />
    <Title>{company.company_name}</Title>

    <Error>
      Unfortunately, this provider is not yet registered to the Catapillr
      scheme.
    </Error>
    <Copy>
      Please read the <span className="font-bold">How does this work? </span>
      section on the right to learn more about your next steps.
    </Copy>
    <Input
      name="providerEmail"
      component={TextInput}
      className="w-full mt-10 mb-10"
      placeholder="Provider's email address..."
    />
    <Next onClick={incrementPage}>Next</Next>
  </Container>
)

Email.validationSchema = validation
Email.componentName = "Email"

export default Email
