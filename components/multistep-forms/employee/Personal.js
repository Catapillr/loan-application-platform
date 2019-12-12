import * as Yup from 'yup'
import moment from 'moment'
import * as R from 'ramda'

import Questions from '../Questions'
import { TextInput, DateInput } from '../../Input'

import zeroIndexMonth from '../../../utils/zeroIndexMonth'
import keepFieldCleanOnChange from '../../../utils/keepFieldCleanOnChange'

import progress3 from '../../../static/images/progress3.svg'

const validation = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required('Required'),
  lastName: Yup.string()
    .trim()
    .required('Required'),
  dob: Yup.object(),
})

const validateDate = date => {
  const { day, month, year } = date

  const dateMonthZeroIndexed = zeroIndexMonth(date)
  const dob = moment(dateMonthZeroIndexed)

  const dateIsValid = dob.isValid()
  const futureDate = dob.isAfter(moment())
  const invalidDOB = dob.isAfter(moment().subtract(18, 'years'))

  if (!day || !month || !year) {
    return 'Please enter a whole date'
  }
  if (!dateIsValid) {
    return "That's not a valid date. Please check it again."
  }
  if (futureDate) {
    return 'That date is in the future!'
  }
  if (invalidDOB) {
    return "Sorry, but you're not old enough to qualify for a loan :("
  }
}

const Personal = ({ values: { dob }, setFieldValue }) => (
  <Questions
    formWidth="65"
    title="3.1 Your personal details"
    questions={[
      {
        text: 'First name',
        name: 'firstName',
        component: TextInput,
        width: '1/2',
        placeholder: 'e.g. Maria',
      },
      {
        text: 'Last name',
        name: 'lastName',
        component: TextInput,
        width: '1/2',
        placeholder: 'e.g. Wilson',
      },
      {
        text: 'What is your date of birth?',
        name: 'dob',
        component: DateInput,
        custom: true,
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
        validate: () => validateDate(dob),
      },
    ]}
  />
)

Personal.validationSchema = validation
Personal.progressImg = progress3
Personal.componentName = 'Personal'

export default Personal
