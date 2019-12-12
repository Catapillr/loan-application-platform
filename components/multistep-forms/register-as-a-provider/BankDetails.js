import * as Yup from 'yup'
import * as R from 'ramda'
import styled from 'styled-components'
import UkModulusChecking from 'uk-modulus-checking'

import { Heading, Copy } from '../styles'
import Questions from '../Questions'
import { SortCodeInput, NumberInput } from '../../Input'

import keepFieldCleanOnChange from '../../../utils/keepFieldCleanOnChange'

import providerProgress4 from '../../../static/images/providerProgress4.svg'

const validation = Yup.object().shape({
  accountNumber: Yup.string().required(),
  sortCode: Yup.object().required(),
})

const Container = styled.main.attrs({
  className: 'flex flex-col',
})`
  width: 65%;
`

const validateUKBankAccount = (
  accountNumber,
  { firstSection, secondSection, thirdSection },
) => {
  let error
  const isValid = new UkModulusChecking({
    accountNumber,
    sortCode: `${firstSection}${secondSection}${thirdSection}`,
  }).isValid()

  if (!isValid) {
    error =
      'Your UK bank account details are invalid. Please double-check them!'
  }
  return error
}

const BankDetails = ({
  values: { accountNumber, sortCode },
  setFieldValue,
}) => (
  <Container>
    <Heading className="mb-5">
      We need a few details from you to verify you as an eligible provider.
    </Heading>
    <Copy className="mb-5">
      Please confirm your bank account details and sort code.
    </Copy>
    <Questions
      formWidth="100"
      title="3 Bank Details"
      questions={[
        {
          text: 'Account Number',
          name: 'accountNumber',
          component: NumberInput,
          maxLength: 8,
          onChange: keepFieldCleanOnChange(
            setFieldValue,
            'accountNumber',
            /^[0-9\b]+$/,
          ),
          width: '1/2',
        },
        {
          text: 'Sort Code',
          component: SortCodeInput,
          custom: true,
          name: 'sortCode',
          keepFieldCleanOnChange: keepFieldCleanOnChange(
            setFieldValue,
            R.__,
            /^[0-9\b]+$/,
          ),
          width: 'full',
          validate: () => validateUKBankAccount(accountNumber, sortCode),
        },
      ]}
    />
  </Container>
)

BankDetails.validationSchema = validation
BankDetails.progressImg = providerProgress4
BankDetails.componentName = 'BankDetails'

export default BankDetails
