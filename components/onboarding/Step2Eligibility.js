import * as Yup from "yup"
import * as moment from "moment"

import Questions from "./Questions"
import { TextInput, CheckboxInput } from "../../components/Input"

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
  const futureDate = employmentStartDate.isAfter(moment())
  const invalidStart = employmentStartDate.isAfter(minimumServiceDate)

  if (!day || !month || !year) {
    return "Please enter a whole date"
  }
  if (!dateIsValid) {
    return "That's not a valid date. Please check it again."
  }
  if (futureDate) {
    return "That date is in the future!"
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
    formWidth="70"
    title="We need a few details from you to verify that you are eligible"
    questions={[
      {
        text: "When did you start working for your employer?",
        date: true,
        name: "employmentStartDate",
        validate: () => validateDate(minimumServiceLength, employmentStartDate),
      },
      {
        text: "Please enter your work email:",
        name: "email",
        type: "email",
        component: TextInput,
        className: "",
        validate: value => validateEmail(emailSuffix, value),
        placeholder: "e.g. dan@example.com",
      },
      {
        text: "I confirm that my current role is permanent:",
        name: "permanentRole",
        className: "",
        type: "checkbox",
        component: CheckboxInput,
      },
    ]}
  />
)

Step2.validationSchema = validation

export default Step2
