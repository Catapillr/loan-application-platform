import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Heading, Copy, Button } from "./styles"

const Step1 = () => (
  <main className="flex justify-center items-center flex-col">
    {/* <main> */}
    <Heading className="mb-6 text-center">Welcome to Catapillr!</Heading>
    <Copy className="mb-12">
      We've partnered up with{" "}
      <span className="font-bold">London Metropolitan University</span> to offer
      you interest-free childcare loans to help tide you over and hopefully make
      both your work life and your home life more rewarding. Press the button
      below to see how much you could borrow from your employer!
    </Copy>
    <Button className="text-center">Let's get started</Button>
  </main>
)

export default Step1
