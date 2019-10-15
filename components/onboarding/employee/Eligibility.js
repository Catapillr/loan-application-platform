import * as Yup from "yup"
import moment from "moment"
import * as R from "ramda"
import axios from "axios"

import Questions from "../Questions"
import { TextInput, CheckboxInput, DateInput } from "../../Input"
import { USER } from "../../../utils/constants"
import zeroIndexMonth from "../../../utils/zeroIndexMonth"

import progress1 from "../../../static/images/progress1.svg"

const validation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  employmentStartDate: Yup.object().required(),
  permanentRole: Yup.boolean().oneOf(
    [true],
    "Sorry, you must be in a permanent role to apply!"
  ),
})

const doesEmailExist = async ({ email }) => {
  const res = await axios(
    `${process.env.HOST}/api/does-email-exist?email=${email}&accountType=${USER}`
  )

  const {
    data: { doesEmailExist },
  } = res

  return doesEmailExist
}

const validateEmail = async (emailSuffixes, value) => {
  let error

  const valueEndsWithEligibleSuffix = R.any(suffix =>
    value.endsWith(suffix.domain)
  )(emailSuffixes)

  if (!valueEndsWithEligibleSuffix) {
    error = "Sorry! You need a work email address to sign up."
    return error
  }

  const emailExists = await doesEmailExist({ email: value })
  if (emailExists) {
    error = "Looks like you've already created an account! Try signing in?"
    return error
  }
}

const validateDate = (minimumServiceLength, date) => {
  const { day, month, year } = date
  const dateMonthZeroIndexed = zeroIndexMonth(date)
  const employmentStartDate = moment(dateMonthZeroIndexed)
  const minimumServiceDate = moment().subtract(minimumServiceLength, "months")

  const dateIsValid = employmentStartDate.isValid()
  const futureDate = employmentStartDate.isAfter(moment())
  const invalidStart = employmentStartDate.isAfter(minimumServiceDate)
  const ancientDate = employmentStartDate.isBefore(
    moment().subtract(170, "years")
  )

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
    return "Sorry, you haven't been working long enough to qualify for a loan."
  }
  if (ancientDate) {
    return "You selected a date over 170 years ago! Are you sure?"
  }
}

const Eligibility = ({ employer, values: { employmentStartDate } }) => {
  const { emailSuffixes, minimumServiceLength } = employer
  return (
    <Questions
      formWidth="70"
      title="We need a few details from you to verify that you are eligible"
      questions={[
        {
          text:
            "The childcare cash advance scheme is currently only available for permanent employees. Please click the box below to confirm you are a permanent employee.",
          name: "permanentRole",
          className: "",
          type: "checkbox",
          component: CheckboxInput,
        },
        {
          text: "When did you start working for your employer?",
          date: true,
          name: "employmentStartDate",
          validate: () =>
            validateDate(minimumServiceLength, employmentStartDate),
        },
        {
          text: "Please enter your work email:",
          name: "email",
          type: "email",
          component: TextInput,
          className: "",
          validate: value => validateEmail(emailSuffixes, value),
          placeholder: "e.g. dan@example.com",
        },
      ]}
    />
  )
}

Eligibility.validationSchema = validation
Eligibility.progressImg = progress1
Eligibility.componentName = "Eligibility"

export default Eligibility
