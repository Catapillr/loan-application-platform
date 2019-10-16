import { Heading, Copy, Button } from "../styles"

import progress1 from "../../../static/images/progress1.svg"
import styled from "styled-components"

import formatToCurrencyString from "../../../utils/formatToCurrencyString"
import { PENNIES } from "../../../utils/constants"

const Link = styled.a.attrs({
  className: "mb-5d5 text-center text-teal font-bold",
})``

const Welcome = ({ user, paymentRequest, incrementPage }) => (
  <main className="flex justify-center items-center flex-col w-5/12 m-auto">
    <Heading className="mb-6 self-start">
      {`Great news! ${user.firstName} ${
        user.lastName
      } would like to pay you ${formatToCurrencyString(
        paymentRequest.amountToPay,
        PENNIES
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
Welcome.progressImg = progress1
Welcome.componentName = "Welcome"

export default Welcome
