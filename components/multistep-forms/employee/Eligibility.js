import * as Yup from 'yup'
import moment from 'moment'
import * as R from 'ramda'
import axios from 'axios'

import Questions from '../Questions'
import { TextInput, CheckboxInput, DateInput } from '../../Input'
import { USER } from '../../../utils/constants'
import zeroIndexMonth from '../../../utils/zeroIndexMonth'
import keepFieldCleanOnChange from '../../../utils/keepFieldCleanOnChange'

import progress1 from '../../../static/images/progress1.svg'

const validation = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  employmentStartDate: Yup.object().required(),
  permanentRole: Yup.boolean().oneOf(
    [true],
    'Sorry, you must be a current employee to apply!',
  ),
})

const doesEmailExist = async ({ email }) => {
  const res = await axios(
    `${process.env.HOST}/api/does-email-exist?email=${email}&accountType=${USER}`,
  )

  const {
    data: { doesEmailExist },
  } = res

  return doesEmailExist
}

const validateEmail = async (emailSuffixes, value) => {
  let error

  const valueEndsWithEligibleSuffix = R.any(suffix =>
    value.endsWith(suffix.domain),
  )(emailSuffixes)

  if (!valueEndsWithEligibleSuffix) {
    error = 'Sorry! You need a work email address to sign up.'
    return error
  }

  const emailExists = await doesEmailExist({ email: value })
  if (emailExists) {
    error =
      "Looks like you've already created an account! Try signing in at app.catapillr.com/dashboard"
    return error
  }
}

const validateDate = (minimumServiceLength, date) => {
  const { day, month, year } = date
  const dateMonthZeroIndexed = zeroIndexMonth(date)
  const employmentStartDate = moment(dateMonthZeroIndexed)
  const minimumServiceDate = moment().subtract(minimumServiceLength, 'months')

  const dateIsValid = employmentStartDate.isValid()
  const futureDate = employmentStartDate.isAfter(moment())
  const invalidStart = employmentStartDate.isAfter(minimumServiceDate)
  const ancientDate = employmentStartDate.isBefore(
    moment().subtract(170, 'years'),
  )

  if (!day || !month || !year) {
    return 'Please enter a whole date'
  }
  if (!dateIsValid) {
    return "That's not a valid date. Please check it again."
  }
  if (futureDate) {
    return 'That date is in the future!'
  }
  if (invalidStart) {
    return "Sorry, you haven't been working long enough to qualify for a loan."
  }
  if (ancientDate) {
    return 'You selected a date over 170 years ago! Are you sure?'
  }
}

const Eligibility = ({
  employer,
  values: { employmentStartDate },
  setFieldValue,
}) => {
  const { emailSuffixes, minimumServiceLength, name } = employer
  return (
    <Questions
      formWidth="70"
      title="To confirm your eligibility for the scheme, please answer the following questions."
      questions={[
        {
          text: `The Childcare Cash Advance Scheme is currently only available for current employees. Please click the circle below to confirm you are a current employee of ${name}.`,
          name: 'permanentRole',
          className: '',
          type: 'checkbox',
          component: CheckboxInput,
        },
        {
          text: 'When did you start working for your employer?',
          custom: true,
          component: DateInput,
          name: 'employmentStartDate',
          keepFieldCleanOnChangeDayMonth: keepFieldCleanOnChange(
            setFieldValue,
            R.__,
            /^[0-9\b]{0,2}$/,
          ),
          keepFieldCleanOnChangeYear: keepFieldCleanOnChange(
            setFieldValue,
            R.__,
            /^[0-9\b]{0,4}$/,
          ),
          validate: () =>
            validateDate(minimumServiceLength, employmentStartDate),
        },
        {
          text: 'Please enter your work email:',
          name: 'email',
          type: 'email',
          component: TextInput,
          className: '',
          validate: value => validateEmail(emailSuffixes, value),
          placeholder: 'e.g. dan@example.com',
        },
      ]}
    />
  )
}

Eligibility.validationSchema = validation
Eligibility.progressImg = progress1
Eligibility.componentName = 'Eligibility'

export default Eligibility
