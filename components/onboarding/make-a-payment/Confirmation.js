import * as Yup from "yup"
import styled from "styled-components"

import Tick from "../../../static/icons/tick-in-circle.svg"
import penniesToPounds from "../../../utils/penniesToPounds"

const Container = styled.section.attrs({
  className: "w-full block bg-white px-10 py-10",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Icon = styled.img.attrs({
  className: "mb-6 m-auto",
  src: Tick,
})``
const Title = styled.label.attrs({
  className: "block ttu font-bold text-center font-lg",
})``

const Copy = styled.p.attrs({
  className: "text-center",
})``

const Next = styled.a.attrs({
  className:
    "text-teal border border-teal rounded-full py-2 px-6 text-center text-center m-auto block",
})`
  width: fit-content;
`

const Link = styled.a.attrs({
  className: "mb-6 text-center text-teal block",
})``

const WhatHappensNext = styled.div.attrs({
  className:
    "border-t border-b border-midgray py-8 flex flex-col items-center justify-center mb-6",
})``

const validation = Yup.object().shape({
  providerEmail: Yup.string()
    .email("Please enter a valid email")
    .required("Required!"),
})

const Confirmation = ({
  company,
  values: { providerEmail, amountToPay },
  isProviderRegistered,
}) => (
  <Container>
    <Icon />
    <Copy>
      {isProviderRegistered
        ? "You sent a payment to"
        : "You sent a magic link to"}
    </Copy>
    <Title>{company.company_name}</Title>
    <Link>{providerEmail}</Link>
    <Copy>
      {isProviderRegistered
        ? "The payment amount was"
        : "Your magic link contains the amount of"}
    </Copy>
    <Copy className="font-subheader mb-6">{penniesToPounds(amountToPay)}</Copy>
    <WhatHappensNext>
      <Copy className="font-bold w-11/12">
        {isProviderRegistered
          ? "The payment should arrive in their bank account within 24 hours."
          : "You will not be charged until your provider signs up to the Catapillr scheme and reclaims their payment."}
      </Copy>
      {!isProviderRegistered && (
        <Copy className="w-11/12">
          You will hear from us as soon as that happens.
        </Copy>
      )}
    </WhatHappensNext>
    <Next href="/dashboard">Return to dashboard</Next>
  </Container>
)

Confirmation.validationSchema = validation
Confirmation.componentName = "Confirmation"

export default Confirmation
