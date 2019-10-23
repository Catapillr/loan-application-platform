import { Heading, Copy, Button } from "../styles"

import providerProgress1 from "../../../static/images/providerProgress1.svg"
import styled from "styled-components"

import currencyFormatter from "currency-formatter"

import penniesToPounds from "../../../utils/penniesToPounds"

const Link = styled.a.attrs({
  className: "mb-5d5 text-center text-teal font-bold",
})``

const Welcome = ({ user, paymentRequest, incrementPage }) => (
  <main className="flex justify-center items-center flex-col w-5/12 m-auto">
    <Heading className="mb-6 self-start">
      {`Great news! ${user.firstName} ${
        user.lastName
      } would like to pay you ${currencyFormatter.format(
        penniesToPounds(paymentRequest.amountToPay),
        { code: "GBP" }
      )}! 🎉
      `}
    </Heading>
    <Copy className="mb-6">
      We just need a few details from you to allow Jessica to pay you using her{" "}
      <Link href="/" target="_blank">
        Catapillr interest-free childcare loan
      </Link>
      ! Press the button below to start the sign-up process. We’ve made sure
      it’s as simple as possible, and you’ll only have to do it once.
    </Copy>
    <Button
      className="shadow-button text-white bg-teal text-center"
      onClick={incrementPage}
    >
      Let's get started
    </Button>
  </main>
)

Welcome.hideControls = true
Welcome.progressImg = providerProgress1
Welcome.componentName = "Welcome"

export default Welcome
