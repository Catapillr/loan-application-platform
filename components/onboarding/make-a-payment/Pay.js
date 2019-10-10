import * as Yup from "yup"
import styled from "styled-components"
import { Input, PriceInput, TextAreaInput } from "../../Input"

import Pen from "../../../static/icons/pen.svg"
import Nursery from "../../../static/icons/nursery.svg"

const validation = Yup.object().shape({
  amountToPay: Yup.string().required("Payment amount is required"),
  reference: Yup.string(),
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
  className: "mb-10 block ttu font-bold text-center font-lg",
})``

const Copy = styled.p.attrs({
  className: "text-center",
})``
const Reference = styled.div.attrs({
  className:
    "border-t border-b border-midgray py-10 flex items-center justify-center mb-10",
})``

const Next = styled.button.attrs({
  className:
    "text-teal border border-teal rounded-full py-2 px-17 text-center block m-auto",
  type: "button",
})``

const Edit = styled.img.attrs({
  src: Pen,
  className: "mr-8",
})``

const formatToCurrency = amount => {
  const sanitised = amount.replace(/[^0-9.]/g, "")

  const currency = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(sanitised)

  return currency !== "£NaN" ? currency : "£0.00"
}

const Pay = ({
  incrementPage,
  setFieldValue,
  company,
  values: { amountToPay },
  Controls,
  isValid,
  submitForm: showErrors,
}) => (
  <Container>
    <Controls />
    <Icon />
    <Title>{company.company_name}</Title>

    <Copy>How much would you like to pay?</Copy>
    <Input
      name="amountToPay"
      onBlur={e =>
        setFieldValue("amountToPay", formatToCurrency(e.target.value))
      }
      component={PriceInput}
      size={amountToPay.length > 7 ? amountToPay.length : 7}
      className="text-center block m-auto"
      placeholder="£0.00"
    />
    <Reference>
      <Edit />
      <Input
        name="reference"
        margin=""
        component={TextAreaInput}
        placeholder="What is this amount for?"
      />
    </Reference>
    <Next
      onClick={() => {
        isValid ? incrementPage() : showErrors()
      }}
    >
      Next
    </Next>
  </Container>
)

Pay.validationSchema = validation
Pay.componentName = "Pay"

export default Pay
