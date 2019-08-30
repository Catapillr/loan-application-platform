import * as Yup from "yup"

import Questions from "./Questions"
import { TextInput } from "../../components/Input"

const validation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  employmentStartDay: Yup.number()
    .min(1)
    .max(31)
    .required("Required"),
  employmentStartMonth: Yup.number()
    .min(1)
    .max(12)
    .required("Required"),
  employmentStartYear: Yup.number()
    .min(1900)
    .max(3000)
    .required("Required"),
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

const Step2 = ({ employer: { emailSuffix } }) => {
  return (
    <Questions
      title="We need a few details from you to verify that you are eligible"
      questions={[
        {
          text: "When did you start working for your employer?",
          dateInputNames: [
            "employmentStartDay",
            "employmentStartMonth",
            "employmentStartYear",
          ],
          component: TextInput,
          name: "employmentStart",
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
}

Step2.validationSchema = validation

export default Step2
