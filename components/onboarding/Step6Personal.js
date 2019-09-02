import * as Yup from "yup"

import Questions from "./Questions"
import { TextInput } from "../../components/Input"

const validation = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("Required"),
  lastName: Yup.string()
    .trim()
    .required("Required"),
  dob: Yup.object(),
})

// TODO: add validation for dob

const Step6 = () => (
  <Questions
    title="3.1 Your personal details"
    questions={[
      {
        text: "First name",
        name: "firstName",
        component: TextInput,
        width: "50",
      },
      {
        text: "Last name",
        name: "lastName",
        component: TextInput,
        width: "50",
      },
      {
        text: "What is your date of birth?",
        date: true,
        // dateInputNames: ["dobDay", "dobMonth", "dobYear"],
        component: TextInput,
        name: "dob",
      },
    ]}
  />
)

Step6.validationSchema = validation

export default Step6
