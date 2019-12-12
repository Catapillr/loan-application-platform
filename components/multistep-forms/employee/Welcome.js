import { Heading, Copy, Button } from '../styles'

import progress1 from '../../../static/images/progress1.svg'

const Welcome = ({ incrementPage, employer }) => (
  <main className="flex justify-center items-center flex-col w-5/12 m-auto">
    <Heading className="mb-6 self-start">
      Hello and welcome to the Childcare Cash Advance Scheme from Catapillr.
    </Heading>
    <Copy className="mb-6">
      <span className="font-bold">{employer.name}</span> has partnered with
      Catapillr to offer you access to the Childcare Cash Advance Scheme, a new
      employee benefit to help with the cost and management of childcare.
    </Copy>
    <Copy className="mb-6">
      Press the button below to see how much you could borrow from your
      employer!
    </Copy>
    <Copy className="mb-12">
      During the application process, please don't use the buttons on your
      browser (e.g. 'back', 'forward', 'refresh' etc.), you should only use the
      buttons on the bottom of each page and you should click these only once.
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
Welcome.componentName = 'Welcome'

export default Welcome
