import * as Yup from "yup"
import styled from "styled-components"

import { Heading, Copy } from "../styles"
import Questions from "../Questions"
import { TextInput, SortCodeInput, NumberInput } from "../../Input"

import progress4 from "../../../static/images/progress4.svg"

const validation = Yup.object().shape({
  bankName: Yup.string().required(),
  accountNumber: Yup.string().required(),
  sortCode: Yup.object().required(),
})

const Container = styled.main.attrs({
  className: "flex flex-col",
})`
  width: 65%;
`

const BankDetails = () => (
  <Container>
    <Heading className="mb-5">
      We need a few details from you to verify you as an eligible provider.
    </Heading>
    <Copy className="mb-5">
      Please confirm your bank account details and sort code.
    </Copy>
    <Questions
      formWidth="100"
      title="3.1 Bank Details"
      questions={[
        {
          text: "UK Bank or Building Society Name",
          name: "bankName",
          component: TextInput,
          width: "full",
          placeholder: "e.g. Triodos Bank...",
        },
        {
          text: "Account Number",
          name: "accountNumber",
          component: NumberInput,
          maxLength: 8,
          width: "1/2",
        },
        {
          text: "Sort Code",
          component: SortCodeInput,
          custom: true,
          name: "sortCode",
          width: "full",
        },
      ]}
    />
    <Questions
      formWidth="100"
      title="3.2 Address"
      questions={[
        {
          text: "UK Bank or Building Society Name",
          name: "bankName",
          component: TextInput,
          width: "full",
          placeholder: "e.g. Triodos Bank...",
        },
        {
          text: "Account Number",
          name: "accountNumber",
          maxLength: 8,
          width: "1/2",
        },
        {
          text: "Sort Code",
          component: SortCodeInput,
          custom: true,
          name: "sortCode",
          width: "full",
        },
      ]}
    />
  </Container>
)

BankDetails.validationSchema = validation
BankDetails.progressImg = progress4
BankDetails.componentName = "BankDetails"

export default BankDetails
