import * as Yup from "yup"
import axios from "axios"
import { parsePhoneNumberFromString } from "libphonenumber-js"

import Questions from "../Questions"
import { TextInput, SelectInput } from "../../Input"

import progress4 from "../../../static/images/progress4.svg"

import nationalityOptions from "../nationalityOptions"

const validation = Yup.object().shape({
  nationality: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
})

const doesPhoneNumberExist = async ({ phoneNumber }) => {
  const encodedPhoneNumber = encodeURIComponent(phoneNumber)
  const res = await axios(
    `${process.env.HOST}/api/does-phonenumber-exist?phonenumber=${encodedPhoneNumber}`
  )

  const {
    data: { doesPhoneNumberExist },
  } = res

  return doesPhoneNumberExist
}

const validatePhoneNumber = async value => {
  const phoneNumber = parsePhoneNumberFromString(value, "GB")
  if (!phoneNumber) {
    return "Please enter a complete phone number."
  }
  if (phoneNumber.countryCallingCode !== "44") {
    return "Please enter a valid UK number"
  }
  if (!phoneNumber.isValid()) {
    return "Sorry, this phone number is not valid."
  }

  const phoneNumberExists = await doesPhoneNumberExist({
    phoneNumber: phoneNumber.number,
  })

  if (phoneNumberExists) {
    return "This phone number is already registered with Catapillr. Do you already have an account?"
  }
}

const Contact = () => (
  <Questions
    formWidth="60"
    title="3.2 Your personal details"
    questions={[
      {
        text: "Nationality",
        name: "nationality",
        type: "select",
        component: SelectInput,
        width: "full",
        options: nationalityOptions,
        placeholder: "Select your nationality",
      },
      {
        text: "Employee ID (if applicable)",
        name: "employeeId",
        component: TextInput,
        width: "1/2",
      },
      {
        text: "Contact number",
        component: TextInput,
        name: "phoneNumber",
        width: "full",
        placeholder: "e.g. 07565111222",
        validate: validatePhoneNumber,
      },
    ]}
  />
)

Contact.validationSchema = validation
Contact.progressImg = progress4
Contact.componentName = "Contact"

export default Contact
