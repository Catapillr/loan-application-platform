import styled from 'styled-components'
import moment from 'moment'
import * as R from 'ramda'
import * as Yup from 'yup'
import R_ from '../../../utils/R_'

import { Heading } from '../styles'
import Questions from '../Questions'
import { CheckboxInput } from '../../Input'

import providerProgress5 from '../../../static/images/providerProgress5.svg'
import { BusinessDetails, UBOs, Documents, BankDetails } from './stepNames'

import nationalities from '../nationalityOptions'

const validation = Yup.object().shape({
  confirmation: Yup.boolean().oneOf(
    [true],
    'You must confirm your information is correct before continuing',
  ),
})

const FileLink = styled.a.attrs({
  className: 'text-teal underline',
  target: '_blank',
})``

const sections = uboSections => [
  {
    heading: '1.1 Business Details',
    fields: [
      {
        title: 'Business Name',
        field: 'businessName',
        page: BusinessDetails,
        disabled: true,
      },
      {
        title: 'Company Number',
        field: 'companyNumber',
        page: BusinessDetails,
        disabled: true,
      },
      {
        title: 'Generic business email',
        field: 'businessEmail',
        page: BusinessDetails,
      },
    ],
  },
  {
    heading: '1.2 Registered Company Address',
    fields: [
      {
        title: 'Address Line 1',
        field: 'AddressLine1',
        page: BusinessDetails,
        disabled: true,
      },
      {
        title: 'Address Line 2',
        field: 'AddressLine2',
        page: BusinessDetails,
        disabled: true,
      },
      {
        title: 'City',
        field: 'City',
        page: BusinessDetails,
        disabled: true,
      },
      {
        title: 'Post code',
        field: 'PostalCode',
        page: BusinessDetails,
        disabled: true,
      },
      {
        title: 'Country',
        field: 'Country',
        page: BusinessDetails,
        disabled: true,
      },
    ],
  },
  {
    heading: '1.3 Details of the Legal Representative',
    fields: [
      {
        title: 'First name',
        field: 'repFirstName',
        page: BusinessDetails,
      },
      {
        title: 'Last name',
        field: 'repLastName',
        page: BusinessDetails,
      },
      {
        title: 'Date of birth',
        field: 'repDob',
        page: BusinessDetails,
      },
      {
        title: 'Country of residence',
        field: 'repCountryOfResidence',
        page: BusinessDetails,
      },
      {
        title: 'Nationality',
        field: 'repNationality',
        page: BusinessDetails,
      },
    ],
  },
  ...uboSections,
  {
    heading: 'Documents',
    fields: [
      {
        title: 'Proof of ID',
        field: 'repProofOfId',
        page: Documents,
      },
      {
        title: 'Articles of Association',
        field: 'articlesOfAssociation',
        page: Documents,
      },
      {
        title: 'Proof of Registration',
        field: 'proofOfRegistration',
        page: Documents,
      },
    ],
  },
  {
    heading: 'Bank Details',
    fields: [
      {
        title: 'Account Number',
        field: 'accountNumber',
        page: BankDetails,
      },
      {
        title: 'Sort Code',
        field: 'sortCode',
        page: BankDetails,
      },
    ],
  },
]

const getValues = field => values => {
  const lensToValue = R.lensPath(field.split('.'))
  const value = R.view(lensToValue)(values)
  switch (true) {
    case field === 'sortCode':
      return `${value.firstSection}-${value.secondSection}-${value.thirdSection}`
    case !!value.year && !!value.month && !!value.day:
      return moment(
        `${value.month} ${value.day} ${value.year}`,
        'MM-DD-YYYY',
      ).format('DD MMMM YYYY')
    case field === 'permanentRole':
      return 'Permanent role'
    case field === 'loanAmount':
      return `£${value}`
    case field === 'monthlyRepayment':
      return `£${values.loanAmount / values.loanTerms}`
    case field === 'repNationality' ||
      field === 'repCountryOfResidence' ||
      field === 'Country' ||
      field.endsWith('Country'):
      return R.pipe(
        R.find(R.propEq('value', value)),
        R.prop('label'),
      )(nationalities)
    case value && value instanceof File:
      return <FileLink href={values[`${field}URI`]}>{value.name}</FileLink>
    case value && value.fileOnServer:
      return (
        <FileLink
          href={`${
            process.env.HOST
          }/api/download-file?${value.webkitRelativePath || value.path}`}
        >
          {value.name}
        </FileLink>
      )
    case !value:
      return 'N/A'
    case typeof value === 'object':
      return JSON.stringify(value)
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
      {fields.map(({ field, title, date, page, disabled }) => (
        <div key={title} className="flex justify-between mb-3">
          <p className="w-2/5 font-bold">{title}</p>
          <p className="w-2/5">{getValues(field, date)(values)}</p>

          <a
            className={`w-1/5 text-right text-teal underline ${page &&
              !disabled &&
              'cursor-pointer'}`}
            onClick={page && !disabled ? () => setPage(page) : null}
          >
            {page && !disabled && 'Change'}
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
  const uboSections = R.pipe(
    R.filter(ubo => !!ubo),
    R_.mapIndexed((ubo, index) => ({
      heading: `2.${index + 1} UBO ${index + 1}: ${ubo.FirstName} ${
        ubo.LastName
      }`,
      fields: [
        {
          title: 'Birthday',
          field: `ubo${index + 1}.Birthday`,
          page: UBOs,
        },

        {
          title: 'City of Birth',
          field: `ubo${index + 1}.Birthplace.City`,
          page: UBOs,
        },
        {
          title: 'Country of Birth',
          field: `ubo${index + 1}.Birthplace.Country`,
          page: UBOs,
        },
      ],
    })),
  )([values.ubo1, values.ubo2, values.ubo3, values.ubo4])

  return (
    <main className="flex justify-center items-start flex-col m-auto font-base">
      <Heading className="mb-2">Thanks {values.repFirstName}</Heading>
      <Heading>
        Please check your answers before we send your details off.
      </Heading>
      <SummaryContainer className="border border-midgray p-8 mt-10 w-full">
        {sections(uboSections).map(section => {
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
          ]}
        />
      </SummaryContainer>
    </main>
  )
}

Summary.progressImg = providerProgress5
Summary.componentName = 'Summary'
Summary.validationSchema = validation

export default Summary
