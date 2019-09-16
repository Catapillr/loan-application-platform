import { Heading, Copy, Button } from "./styles"

import progress1 from "../../static/images/progress1.svg"

// TODO: tell people not to press back and forward buttons

const Welcome = ({ incrementPage, employer }) => (
  <main className="flex justify-center items-center flex-col w-5/12 m-auto">
    <Heading className="mb-6 self-start">Welcome to Catapillr!</Heading>
    <Copy className="mb-12">
      We've partnered up with <span className="font-bold">{employer.name}</span>{" "}
      to offer you interest-free childcare loans to help tide you over and
      hopefully make both your work life and your home life more rewarding.
      Press the button below to see how much you could borrow from your
      employer!
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

export default Welcome