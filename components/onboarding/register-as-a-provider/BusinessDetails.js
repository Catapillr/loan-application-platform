import * as Yup from "yup"
import * as R from "ramda"
import moment from "moment"
import styled from "styled-components"

import Questions from "../Questions"
import { Heading, Copy } from "../styles"

import { TextInput, SelectInput, DateInput } from "../../Input"
import nationalityOptions from "../nationalityOptions"

import providerProgress1 from "../../../static/images/providerProgress1.svg"

const Container = styled.main.attrs({
  className: "flex flex-col",
})`
  width: 65%;
`

const nationalityValues = R.map(R.prop("value"))(nationalityOptions)

const validation = Yup.object().shape({
  businessName: Yup.string().required("This is a required field"),
  businessEmail: Yup.string()
    .email("Please enter a valid email for your business")
    .required("This is a required field"),
  companyNumber: Yup.string().required("This is a required field"),
  repFirstName: Yup.string().required("This is a required field"),
  repLastName: Yup.string().required("This is a required field"),
  repDob: Yup.object().required("This is a required field"),
  repCountryOfResidence: Yup.string()
    .oneOf(nationalityValues, "Please select a valid country")
    .required("This is a required field"),
  repNationality: Yup.string()
    .oneOf(nationalityValues, "Please select a valid country")
    .required("This is a required field"),

  AddressLine1: Yup.string().required("This is a required field"),
  AddressLine2: Yup.string(),
  City: Yup.string().required("This is a required field"),
  Region: Yup.string().required("This is a required field"),
  PostalCode: Yup.string().required("This is a required field"),
  Country: Yup.string().required("This is a required field"),
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
    return "You selected a date over 170 years ago! Are you sure?"
  }
}

const BusinessDetails = ({ values: { repDob } }) => (
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
          disabled: true,
          className: "bg-lightgray",
        },
        {
          text: "Company Number",
          name: "companyNumber",
          component: TextInput,
          width: "1/2",
          disabled: true,
          className: "bg-lightgray",
        },
        {
          text: "Generic business email",
          name: "businessEmail",
          component: TextInput,
          placeholder: "Example: info@catapillr.com",
        },
      ]}
    />
    <Questions
      formWidth="100"
      title="1.2 Registered Company Address"
      questions={[
        {
          text: "Address Line 1",
          name: "AddressLine1",
          component: TextInput,
          width: "full",
          placeholder: "148 Fonthill Road",
          disabled: true,
          className: "bg-lightgray",
        },
        {
          text: "Address Line 2",
          name: "AddressLine2",
          component: TextInput,
          width: "full",
          placeholder: "Finsbury Park",
          disabled: true,
          className: "bg-lightgray",
        },
        {
          text: "City",
          name: "City",
          component: TextInput,
          width: "1/2",
          placeholder: "Stroud",
          disabled: true,
          className: "bg-lightgray",
        },
        {
          text: "Post code",
          name: "PostalCode",
          component: TextInput,
          width: "1/2",
          placeholder: "AB1 3NT",
          disabled: true,
          className: "bg-lightgray",
        },

        {
          text: "Country",
          name: "Country",
          component: SelectInput,
          options: nationalityOptions,
          width: "full",
          placeholder: "Select country",
          disabled: true,
          className: "bg-lightgray",
        },
      ]}
    />
    <Questions
      formWidth="100"
      title="1.3 Details of the legal representative"
      className="mb-10"
      questions={[
        {
          text: "First name",
          name: "repFirstName",
          component: TextInput,
          width: "1/2",
          placeholder: "e.g. Maria",
        },
        {
          text: "Last name",
          name: "repLastName",
          component: TextInput,
          width: "1/2",
          placeholder: "e.g. Wilson",
        },
        {
          text: "Date of birth",
          component: DateInput,
          custom: true,
          name: "repDob",
          validate: () => validateDate(repDob),
        },
        {
          text: "Country of residence",
          name: "repCountryOfResidence",
          type: "select",
          component: SelectInput,
          width: "49/100",
          options: nationalityOptions,
          placeholder: "Select country",
        },
        {
          text: "Nationality",
          name: "repNationality",
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
BusinessDetails.progressImg = providerProgress1
BusinessDetails.componentName = "BusinessDetails"

export default BusinessDetails
