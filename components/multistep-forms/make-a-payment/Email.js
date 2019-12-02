import * as Yup from "yup"
import styled from "styled-components"
import axios from "axios"

import { CHILDCAREPROVIDER } from "../../../utils/constants"
import { Input, TextInput } from "../../Input"

import Nursery from "../../../static/icons/nursery.svg"

const Email = ({ incrementPage, company, Controls, submitForm, isValid }) => (
  <Container>
    <Controls />
    <Icon />
    <Title>{company.company_name}</Title>

    <Error>
      Unfortunately, this provider is not yet registered to the Catapillr
      scheme.
    </Error>
    <p>
      Please read the <span className="font-bold">How does this work? </span>
      section on the right to learn more about your next steps.
    </p>
    <Input
      name="providerEmail"
      component={TextInput}
      className="w-full mt-10"
      placeholder="Provider's email address..."
      validate={validateEmail}
    />
    <Next className="mt-10" onClick={isValid ? incrementPage : submitForm}>
      Next
    </Next>
  </Container>
)

const validation = Yup.object().shape({
  providerEmail: Yup.string()
    .email("Please enter a valid email")
    .required("Required!"),
})

Email.validationSchema = validation
Email.componentName = "Email"

const doesEmailExist = async ({ email }) => {
  const res = await axios(
    `${process.env.HOST}/api/does-email-exist?email=${email}&accountType=${CHILDCAREPROVIDER}`
  )

  const {
    data: { doesEmailExist },
  } = res

  return doesEmailExist
}

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

const Next = styled.button.attrs({
  className:
    "text-teal border border-teal rounded-full py-2 px-17 text-center block m-auto",
  type: "button",
})``

const validateEmail = async value => {
  let error
  const emailExists = await doesEmailExist({ email: value })
  if (emailExists) {
    error = "This email already exists on our system"
    return error
  }
}

export default Email
