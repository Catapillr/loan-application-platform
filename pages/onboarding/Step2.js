import { Formik, Form, Field, ErrorMessage } from "formik"
import { Heading } from "./styles"
import * as Yup from "yup"

const validation = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  dobDay: Yup.number()
    .min(1)
    .max(31)
    .required("Required"),
  dobMonth: Yup.number()
    .min(1)
    .max(12)
    .required("Required"),
  dobYear: Yup.number()
    .min(1900)
    .max(3000)
    .required("Required"),
  permanentRole: Yup.boolean().oneOf(
    [true],
    "Sorry, you must be in a permanent role to apply!"
  ),
})

const Step2 = () => (
  <main className="flex flex-col">
    <Heading>
      We need a few details from you to verify that you are eligible
    </Heading>
    <label htmlFor="dobDay">
      When did you start working for your employer?
    </label>
    <ErrorMessage name="dobDay"></ErrorMessage>
    <Field name="dobDay"></Field>
    <Field name="dobMonth"></Field>
    <ErrorMessage name="dobMonth"></ErrorMessage>
    <Field name="dobYear"></Field>
    <ErrorMessage name="dobYear"></ErrorMessage>
    <label htmlFor="email">Please enter your work email: </label>
    <Field name="email"></Field>
    <ErrorMessage name="email"></ErrorMessage>
    <label htmlFor="permanentRole">
      I confirm that my current role is permanent:
    </label>
    <Field name="permanentRole" type="checkbox"></Field>
    <ErrorMessage name="permanentRole"></ErrorMessage>
  </main>
)

Step2.validationSchema = validation

export default Step2
