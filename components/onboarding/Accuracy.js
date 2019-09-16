import { Heading, Copy, Button } from "./styles"

import progress3 from "../../static/images/progress3.svg"
import { Accuracy } from "./constants"

const Step5 = ({ incrementPage }) => (
  <main className="flex justify-center items-center flex-col w-7/12 m-auto">
    <Heading className="mb-6 text-center self-start">
      Just a quick note…
    </Heading>
    <Copy className="mb-5">
      Before we move on, we have to let you know that the information you
      provide must be <span className="font-bold">100% accurate.</span>
    </Copy>
    <Copy className="mb-12">
      This information will form the basis of the loan agreement and any
      inaccuracies may lead to{" "}
      <span className="font-bold">internal disciplinary action</span> being
      taken, which could lead to loss of employment. In the next section you
      will fill your personal details and confirm that you understand and accept
      this notice.
    </Copy>
    <Button
      className="text-center shadow-button text-white bg-teal"
      onClick={incrementPage}
    >
      Accept and continue
    </Button>
  </main>
)

Step5.hideNext = true
Step5.progressImg = progress3
Step5.title = Accuracy

export default Step5
