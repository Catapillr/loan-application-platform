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

const nationalityValues = R.map(R.prop("value"))(nationalityOptions)

const validation = Yup.object().shape({
  businessName: Yup.string().required("This is a required field"),
  businessEmail: Yup.string()
    .email()
    .required("This is a required field"),
  companyNumber: Yup.string().required("This is a required field"),
  ownerFirstName: Yup.string().required("This is a required field"),
  ownerLastName: Yup.string().required("This is a required field"),
  ownerKeyContact: Yup.string().required("This is a required field"),
  ownerDob: Yup.object().required("This is a required field"),
  ownerCountryOfResidence: Yup.string()
    .oneOf(nationalityValues, "Please select a valid country")
    .required("This is a required field"),
  ownerNationality: Yup.string()
    .oneOf(nationalityValues, "Please select a valid country")
    .required("This is a required field"),
})

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

const BusinessDetails = ({ values: { ownerDob } }) => (
  <Container>
    <Heading className="mb-5">
      We need a few details from you to verify you as an eligible provider.
    </Heading>
    <Copy className="mb-10">
      In order to comply with money laundering rules and so that we can transfer
      funds, securely and quickly, please complete all fields of information.
      See our FAQs if you want ot find out more.
    </Copy>
    <Questions
      formWidth="100"
      className="mb-10"
      title="1.1 Business details"
      questions={[
        {
          text: "Business Name",
          name: "businessName",
          component: TextInput,
          placeholder: "Start here...",
        },
        {
          text: "Generic business email",
          name: "businessEmail",
          component: TextInput,
          placeholder: "Example: info@catapillr.com",
        },
        {
          text: "Company Number",
          name: "companyNumber",
          component: TextInput,
          width: "1/2",
        },
      ]}
    />
    <Questions
      formWidth="100"
      title="1.2 Details of the business owner or legal representative"
      questions={[
        {
          text: "First name",
          name: "ownerFirstName",
          component: TextInput,
          width: "1/2",
          placeholder: "e.g. Maria",
        },
        {
          text: "Last name",
          name: "ownerLastName",
          component: TextInput,
          width: "1/2",
          placeholder: "e.g. Wilson",
        },
        {
          text: "Key contact (in case it's not the legal representative)",
          name: "ownerKeyContact",
          component: TextInput,
        },
        {
          text: "Date of birth",
          component: DateInput,
          custom: true,
          name: "ownerDob",
          validate: () => validateDate(ownerDob),
        },
        {
          text: "Country of residence",
          name: "ownerCountryOfResidence",
          type: "select",
          component: SelectInput,
          width: "49/100",
          options: nationalityOptions,
          placeholder: "Select country",
        },
        {
          text: "Nationality",
          name: "ownerNationality",
          type: "select",
          component: SelectInput,
          width: "49/100",
          options: nationalityOptions,
          placeholder: "Select nationality",
        },
      ]}
    />
  </Container>
)

BusinessDetails.validationSchema = validation
BusinessDetails.progressImg = progress3
BusinessDetails.componentName = "BusinessDetails"

export default BusinessDetails
