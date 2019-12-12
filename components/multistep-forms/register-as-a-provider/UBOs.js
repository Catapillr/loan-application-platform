import * as Yup from 'yup'
import moment from 'moment'
import styled from 'styled-components'
import * as R from 'ramda'
import R_ from '../../../utils/R_'

import Questions from '../Questions'
import { Heading, Copy } from '../styles'

import { TextInput, SelectInput, DateInput } from '../../Input'
import nationalityOptions from '../nationalityOptions'
import zeroIndexMonth from '../../../utils/zeroIndexMonth'
import keepFieldCleanOnChange from '../../../utils/keepFieldCleanOnChange'

import providerProgress2 from '../../../static/images/providerProgress2.svg'

const Container = styled.main.attrs({
  className: 'flex flex-col',
})`
  width: 65%;
`

const validation = Yup.object().shape({})

const validateDate = date => {
  const { day, month, year } = date

  const dateMonthZeroIndexed = zeroIndexMonth(date)
  const dob = moment(dateMonthZeroIndexed)

  const dateIsValid = dob.isValid()
  const futureDate = dob.isAfter(moment())
  const ancientDate = dob.isBefore(moment().subtract(170, 'years'))

  if (!day || !month || !year) {
    return 'Please enter a whole date'
  }
  if (!dateIsValid) {
    return "That's not a valid date. Please check it again."
  }
  if (futureDate) {
    return 'That date is in the future!'
  }
  if (ancientDate) {
    return 'You selected a date over 170 years ago! Are you sure?'
  }
}

const UBOQuestion = ({ setFieldValue, ubo, index }) => (
  <Questions
    key={`ubo${index + 1}`}
    formWidth="100"
    className="mb-10"
    title={`2.${index + 1} Ultimate beneficial owner ${index + 1}: ${
      ubo.FirstName
    } ${ubo.LastName}`}
    questions={[
      {
        text: `What is ${ubo.FirstName}'s birthday?`,
        name: `ubo${index + 1}.Birthday`,
        component: DateInput,
        disabled: { day: false, month: true, year: true },
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
        validate: () => validateDate(ubo.Birthday),
      },
      {
        text: `Which city was ${ubo.FirstName} born in?`,
        name: `ubo${index + 1}.Birthplace.City`,
        component: TextInput,
        validate: value => !value && 'Required',
      },
      {
        text: `Which country was ${ubo.FirstName} born in?`,
        name: `ubo${index + 1}.Birthplace.Country`,
        options: nationalityOptions,
        placeholder: 'Select birthplace',
        component: SelectInput,
        validate: value => !value && 'Required',
      },
    ]}
  />
)

const UBOList = (ubos, setFieldValue) =>
  R.pipe(
    R.filter(ubo => !!ubo),
    R_.mapIndexed((ubo, index) => (
      <UBOQuestion {...{ setFieldValue, ubo, index }}></UBOQuestion>
    )),
  )(ubos)

const UBOs = ({ values: { ubo1, ubo2, ubo3, ubo4 }, setFieldValue }) => (
  <Container>
    <Heading className="mb-5">
      We need a few details from you to verify you as an eligible provider.
    </Heading>
    <Copy className="mb-10">
      In order to comply with money laundering rules and so that we can transfer
      funds, securely and quickly, please complete all fields of information.
      See our FAQs if you want ot find out more.
    </Copy>
    {UBOList([ubo1, ubo2, ubo3, ubo4], setFieldValue)}
  </Container>
)

UBOs.validationSchema = validation
UBOs.progressImg = providerProgress2
UBOs.componentName = 'UBOs'

export default UBOs
