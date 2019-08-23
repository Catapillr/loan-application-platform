import { Formik, Form, Field, ErrorMessage } from "formik"
import Input from "../components/Input"
import * as Yup from "yup"

const validation = Yup.object().shape({})

const StepTemplate = () => (
  <main className="flex flex-col">
    <h1>Step Title</h1>
    <Input
      question="Your question"
      Field={"Your field component"}
      name="Your question's html name"
    />
    <Input
      question="Your question"
      Field={"Your field component"}
      name="Your question's html name"
    />
  </main>
)

StepTemplate.validationSchema = validation

export default StepTemplate
