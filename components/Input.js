import { ErrorMessage } from "formik"

const Input = ({ question, Field, name }) => (
  <div>
    <label htmlFor={name}>{question}</label>
    <Field name={name} />
    <ErrorMessage className="red" name={name} />
  </div>
)

export default Input
