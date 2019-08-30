import { Heading } from "./styles"
import * as Yup from "yup"
import * as moment from "moment"

import Questions from "./Questions"
import { TextInput } from "../../components/Input"

const validation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  employmentStartDate: Yup.object(),
  permanentRole: Yup.boolean().oneOf(
    [true],
    "Sorry, you must be in a permanent role to apply!"
  ),
})

const validateEmail = (emailSuffix, value) => {
  let error
  if (!value.endsWith(emailSuffix)) {
    error = "Sorry! You need a work email address to sign up."
  }
  return error
}

const validateDate = (minimumServiceLength, { day, month, year }) => {
  const employmentStartDate = moment(`${year}-${month}-${day}`)
  const minimumServiceDate = moment().subtract(minimumServiceLength, "months")

  const dateIsValid = employmentStartDate.isValid()
  const invalidStart = employmentStartDate.isAfter(minimumServiceDate)

  if (!day || !month || !year) {
    return "Please enter a whole date"
  }
  if (!dateIsValid) {
    return "That's not a valid date. Please check it again."
  }
  if (invalidStart) {
    return "Sorry, but you haven't been working long enough to qualify for a loan :( Come back soon!"
  }
}

const Step2 = ({
  employer: { emailSuffix, minimumServiceLength },
  values: { employmentStartDate },
}) => (
  <Questions
    title="We need a few details from you to verify that you are eligible"
    questions={[
      {
        text: "When did you start working for your employer?",
        date: true,
        component: TextInput,
        name: "employmentStartDate",
        validate: () => validateDate(minimumServiceLength, employmentStartDate),
      },
      {
        text: "Please enter your work email:",
        name: "email",
        component: TextInput,
        className: "",
        width: "full",
        validate: value => validateEmail(emailSuffix, value),
      },
      {
        text: "I confirm that my current role is permanent:",
        name: "permanentRole",
        className: "",
        fieldType: "checkbox",
        width: "full",
      },
    ]}
  />
)

Step2.validationSchema = validation

export default Step2
