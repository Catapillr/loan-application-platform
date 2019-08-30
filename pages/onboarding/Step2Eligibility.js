import * as Yup from "yup" //eslint-disable-line

import Questions from "./Questions"
import { TextInput, CheckboxInput } from "../../components/Input"

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

const Step2 = () => (
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
        name: "employmentStart",
      },
      {
        text: "Please enter your work email:",
        name: "email",
        component: TextInput,
        className: "",
        placeholder: "E.g. dan@example.com",
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
