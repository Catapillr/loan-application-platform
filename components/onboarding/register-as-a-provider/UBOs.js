import * as Yup from "yup"
import * as R from "ramda"
import moment from "moment"
import styled from "styled-components"

import Questions from "../Questions"
import { Heading, Copy } from "../styles"

import { TextInput, SelectInput, DateInput } from "../../Input"
import nationalityOptions from "../nationalityOptions"

import progress3 from "../../../static/images/progress3.svg"

const Container = styled.main.attrs({
  className: "flex flex-col",
})`
  width: 65%;
`

const validation = Yup.object().shape({})

const validateDate = date => {
  const { day, month, year } = date
  const dob = moment(date)

  const dateIsValid = dob.isValid()
  const futureDate = dob.isAfter(moment())
  const ancientDate = dob.isBefore(moment().subtract(170, "years"))

  if (!day || !month || !year) {
    return "Please enter a whole date"
  }
  if (!dateIsValid) {
    return "That's not a valid date. Please check it again."
  }
  if (futureDate) {
    return "That date is in the future!"
  }
  if (ancientDate) {
    return "Yous selected a date over 170 years ago! Are you sure?"
  }
}

const UBOQuestion = (ubo, index) => (
  <Questions
    formWidth="100"
    className="mb-10"
    title={`2.${index + 1} Ultimate beneficial owner ${index + 1}: ${
      ubo.FirstName
    } ${ubo.LastName}`}
    questions={[
      {
        text: `What is ${ubo.FirstName}'s birthday?`,
        name: `ubo${index + 1}.Birthday`,
        component: DateInput,
        custom: true,
        validate: () => validateDate(ubo.Birthday),
      },
      {
        text: `Which city was ${ubo.FirstName} born in?`,
        name: `ubo${index + 1}.Birthplace.City`,
        component: TextInput,
      },
      {
        text: `Which country was ${ubo.FirstName} born in?`,
        name: `ubo${index + 1}.Birthplace.Country`,
        options: nationalityOptions,
        placeholder: "Select birthplace",
        component: SelectInput,
      },
    ]}
  />
)

const UBOList = ubos =>
  R.pipe(
    R.filter(ubo => !!ubo),
    R.addIndex(R.map)(UBOQuestion)
  )(ubos)

const UBOs = ({ values: { ubo1, ubo2, ubo3, ubo4 } }) => (
  <Container>
    <Heading className="mb-5">
      We need a few details from you to verify you as an eligible provider.
    </Heading>
    <Copy className="mb-10">
      In order to comply with money laundering rules and so that we can transfer
      funds, securely and quickly, please complete all fields of information.
      See our FAQs if you want ot find out more.
    </Copy>
    {UBOList([ubo1, ubo2, ubo3, ubo4])}
    {/* {JSON.stringify(ubo4)} */}
  </Container>
)

// "AddressLine1": "1 Mangopay Street",
// "AddressLine2": "The Loop",
// "City": "Paris",
// "Region": "Ile de France",
// "PostalCode": "75001",
// "Country": "FR"

UBOs.validationSchema = validation
UBOs.progressImg = progress3
UBOs.componentName = "UBOs"

export default UBOs
