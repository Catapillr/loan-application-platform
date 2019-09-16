import * as Yup from "yup"
import { parsePhoneNumberFromString } from "libphonenumber-js"

import Questions from "./Questions"
import { TextInput, SelectInput } from "../../components/Input"

import progress4 from "../../static/images/progress4.svg"

import nationalityOptions from "./nationalityOptions"

const validation = Yup.object().shape({
  nationality: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
})

const validatePhoneNumber = async value => {
  const phoneNumber = parsePhoneNumberFromString(value, "GB")
  console.log("phoneNumber", phoneNumber)
  if (!phoneNumber) {
    return "Please enter a complete phone number."
  }
  if (phoneNumber.countryCallingCode !== "44") {
    return "Please enter a valid UK number"
  }
  if (!phoneNumber.isValid()) {
    return "Sorry, this phone number is not valid."
  }

}

const Step7 = () => (
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
      },
      {
        text: "Employee ID (if applicable)",
        name: "employeeID",
        component: TextInput,
        width: "1/2",
      },
      {
        text: "Contact number",
        component: TextInput,
        name: "phoneNumber",
        width: "full",
        validate: value => validatePhoneNumber(value),
      },
    ]}
  />
)

Step7.validationSchema = validation
Step7.progressImg = progress4

export default Step7
