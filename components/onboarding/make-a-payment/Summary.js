import * as Yup from "yup"
import styled from "styled-components"
import { Input, PriceInput, TextAreaInput, CheckboxInput } from "../../Input"

import Pen from "../../../static/icons/pen.svg"
import Nursery from "../../../static/icons/nursery.svg"

const validation = Yup.object().shape({
  amountToPay: Yup.string().required("Required!"),
  reference: Yup.string(),
  consentToPay: Yup.boolean(),
})

const Container = styled.section.attrs({
  className: "w-full block bg-white px-10 pb-10 pt-6",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Icon = styled.div.attrs({
  className: "w-12 h-12 mb-3 m-auto",
})`
  background-image: url(${Nursery});
`
const Title = styled.label.attrs({
  className: "block ttu font-bold text-center font-lg",
})``

const Copy = styled.p.attrs({
  className: "text-center",
})``

const Link = styled.a.attrs({
  className: "mb-5d5 text-center text-teal block",
})``

const Reference = styled.div.attrs({
  className:
    "border-t border-b border-midgray py-10 flex items-center justify-center mb-10",
})``

const Submit = styled.button.attrs({
  className:
    "text-teal border border-teal rounded-full py-2 px-17 text-center block m-auto",
  type: "submit",
})``

const formatToCurrency = amount => {
  const currency = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount)

  return currency !== "£NaN" ? currency : "£0.00"
}

const Summary = ({ values, company, Controls }) => (
  <Container>
    <Controls />
    <Icon />
    <Title>{company.company_name}</Title>
    <Link href={`mailto:${values.providerEmail}`}>{values.providerEmail}</Link>

    <Copy>You'll pay</Copy>
    <Input
      name="amountToPay"
      component={PriceInput}
      size="7"
      className="mb-6 text-center block m-auto"
      placeholder="£0.00"
      disabled
    />
    <Reference>
      <Input
        name="reference"
        margin=""
        component={TextAreaInput}
        disabled
        placeholder="What is this amount for?"
      />
    </Reference>
    <Input
      direction="flex-row-reverse"
      name="consentToPay"
      component={CheckboxInput}
      type="checkbox"
      text="By sending this link, you agree to send money to the above provider once they sign up to the Catapillr scheme."
    />
    <Submit>Send magic link</Submit>
  </Container>
)

Summary.validationSchema = validation
Summary.componentName = "Summary"

export default Summary
