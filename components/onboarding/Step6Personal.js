import * as Yup from "yup"
import * as moment from "moment"

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

const validateDate = ({ day, month, year }) => {
  const dob = moment(`${year}-${month}-${day}`)

  const dateIsValid = dob.isValid()
  const futureDate = dob.isAfter(moment())
  const invalidDOB = dob.isAfter(moment().subtract(18, "years"))

  if (!day || !month || !year) {
    return "Please enter a whole date"
  }
  if (!dateIsValid) {
    return "That's not a valid date. Please check it again."
  }
  if (futureDate) {
    return "That date is in the future!"
  }
  if (invalidDOB) {
    return "Sorry, but you're not old enough to qualify for a loan :("
  }
}

const Step6 = ({ values: { dob } }) => (
  <Questions
    formWidth="60"
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
        name: "dob",
        validate: () => validateDate(dob),
      },
    ]}
  />
)

Step6.validationSchema = validation

export default Step6
