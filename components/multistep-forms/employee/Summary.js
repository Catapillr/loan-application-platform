import styled from 'styled-components'
import moment from 'moment'
import * as R from 'ramda'
import * as Yup from 'yup'

import { Heading } from '../styles'
import Questions from '../Questions'
import { CheckboxInput } from '../../Input'

import progress4 from '../../../static/images/progress4.svg'
import { Loan, Personal, Eligibility, Contact, Salary } from './stepNames'

import nationalities from '../nationalityOptions'

const validation = Yup.object().shape({
  confirmation: Yup.boolean().oneOf(
    [true],
    'You must confirm your information is correct before continuing',
  ),
  gdprConsent: Yup.boolean().oneOf(
    [true],
    'Sorry, we need to save your data to process your loan!',
  ),
})

const sections = [
  {
    heading: 'Personal Details',
    fields: [
      { title: 'First name', field: 'firstName', page: Personal },
      { title: 'Last name', field: 'lastName', page: Personal },
      { title: 'Date of birth', field: 'dob', page: Personal },
      { title: 'Nationality', field: 'nationality', page: Contact },
      { title: 'Email', field: 'email', page: Eligibility },
      { title: 'Contact number', field: 'phoneNumber', page: Contact },
    ],
  },
  {
    heading: 'Employment Details',
    fields: [
      {
        title: 'Start date',
        field: 'employmentStartDate',
        page: Eligibility,
      },
      { title: 'Contract type', field: 'permanentRole', page: Eligibility },
      { title: 'Employee ID', field: 'employeeId', page: Contact },
      { title: 'Salary', field: 'annualSalary', page: Salary },
    ],
  },
  {
    heading: 'Your loan application details',
    fields: [
      { title: 'Loan amount', field: 'loanAmount', page: Loan },
      { title: 'Repayment length', field: 'loanTerms', page: Loan },
      { title: 'Average monthly repayment', field: 'monthlyRepayment' },
    ],
  },
]

const getValues = field => values => {
  const value = values[field]
  switch (true) {
    case field === 'dob' || field === 'employmentStartDate':
      return moment(
        `${value.day} ${value.month} ${value.year}`,
        'DD-MM-YYYY',
      ).format('DD MMMM YYYY')
    case field === 'permanentRole':
      return 'Permanent role'
    case field === 'loanAmount':
      return `£${value}`
    case field === 'monthlyRepayment':
      return `£${(values.loanAmount / values.loanTerms).toFixed(2)}`
    case field === 'nationality':
      return R.pipe(
        R.find(R.propEq('value', value)),
        R.prop('label'),
      )(nationalities)
    case !value:
      return 'N/A'
    default:
      return value
  }
}

const SummaryContainer = styled.div`
  border-radius: 6px;
`

const SummarySection = ({ heading, fields, values, setPage }) => {
  return (
    <div className="mb-10">
      <h2 className="uppercase mb-4">{heading}</h2>
      {fields.map(({ field, title, date, page }) => (
        <div key={title} className="flex justify-between mb-3">
          <p className="w-2/5 font-bold">{title}</p>
          <p className="w-2/5">{getValues(field, date)(values)}</p>
          <a
            className="w-1/5 text-right text-teal underline"
            onClick={page ? () => setPage(page) : null}
          >
            {page && 'Change'}
          </a>
        </div>
      ))}
    </div>
  )
}

const Divider = styled.div.attrs({
  className: 'my-8',
})`
  height: 2px;
  background-color: ${cssTheme('colors.midgray')};
  width: 100%;
  opacity: 0.5;
`

const Summary = ({ values, setPage }) => {
  return (
    <main className="flex justify-center items-start flex-col m-auto font-base">
      <Heading className="mb-2">Thanks {values.firstName}</Heading>
      <Heading className="">
        Please check your answers before we create your loan agreement
      </Heading>
      <SummaryContainer className="border border-midgray p-8 mt-10 w-full">
        {sections.map(section => {
          return (
            <SummarySection
              key={section.heading}
              values={values}
              setPage={setPage}
              {...section}
            ></SummarySection>
          )
        })}
        <Divider />
        <Questions
          formWidth="100"
          questions={[
            {
              text:
                'By submitting you are confirming that, to the best of your knowledge, the details you are providing are correct.',
              name: 'confirmation',
              direction: 'flex-row-reverse',
              className: '',
              type: 'checkbox',
              component: CheckboxInput,
              link: {
                text: "I've got some questions",
                href: 'https://catapillr.com/faq/',
              },
            },
            {
              text:
                "I consent to the storage and processing of this information as outlined in Catapillr's privacy policy.",
              name: 'gdprConsent',
              direction: 'flex-row-reverse',
              className: '',
              type: 'checkbox',
              component: CheckboxInput,
              link: {
                text: 'See privacy policy',
                href: 'https://catapillr.com/data-privacy-policy/',
              },
            },
          ]}
        />
      </SummaryContainer>
    </main>
  )
}

Summary.validationSchema = validation
Summary.progressImg = progress4
Summary.componentName = 'Summary'

export default Summary
