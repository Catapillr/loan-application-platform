import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

import Questions from "./Questions"
import { TextInput } from "../../components/Input"

const validation = Yup.object().shape({
  nationality: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
})

const Step7 = () => (
  <Questions
    title="3.2 Your personal details"
    questions={[
      {
        text: "Nationality",
        name: "nationality",
        component: TextInput,
        width: "full",
      },
      {
        text: "Employee ID (if applicable)",
        name: "employeeID",
        component: TextInput,
        width: "full",
      },
      {
        text: "Contact number",
        component: TextInput,
        name: "phoneNumber",
      },
    ]}
  />
)

Step7.validationSchema = validation

export default Step7
