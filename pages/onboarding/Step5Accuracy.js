import { Heading, Copy, Button } from "./styles"

const Step5 = ({ setPage }) => (
  <main className="flex justify-center items-start flex-col w-2/6 m-auto">
    <Heading className="mb-6 text-center">Just a quick note…</Heading>
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
    <Button className="text-center" onClick={() => setPage(6)}>
      Accept and continue
    </Button>
  </main>
)

export default Step5
