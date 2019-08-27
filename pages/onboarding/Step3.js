import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

const validation = Yup.object().shape({
  email: Yup.string()
    .min(2, "Invalid name too short!")
    .required("Required"),
})

const Step2 = () => (
  <main>
    <h1>Step 2</h1>
    <label htmlFor="name">Please enter your name: </label>
    <Field name="name"></Field>
  </main>
)

Step2.validationSchema = validation

export default Step2
