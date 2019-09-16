import * as Yup from "yup"
import moment from "moment"

import Questions from "./Questions"
import { TextInput } from "../Input"

import progress3 from "../../static/images/progress3.svg"

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

const Personal = ({ values: { dob } }) => (
  <Questions
    formWidth="65"
    title="3.1 Your personal details"
    questions={[
      {
        text: "First name",
        name: "firstName",
        component: TextInput,
        width: "1/2",
        placeholder: "e.g. Maria",
      },
      {
        text: "Last name",
        name: "lastName",
        component: TextInput,
        width: "1/2",
        placeholder: "e.g. Wilson",
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

Personal.validationSchema = validation
Personal.progressImg = progress3

export default Personal