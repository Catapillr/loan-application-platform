import * as Yup from "yup"

import Questions from "./Questions"
import { TextInput, SelectInput } from "../../components/Input"

import nationality_options from "./nationalityOptions"
const validation = Yup.object().shape({
  nationality: Yup.string().required("Required"),
  phoneNumber: Yup.string()
    .required("Required")
    .min(10, "Please enter a valid phone number")
    .max(15, "Please enter a valid phone number"),
})

const Step7 = () => (
  <Questions
    formWidth="60"
    title="3.2 Your personal details"
    questions={[
      {
        text: "Nationality",
        name: "nationality",
        type: "select",
        component: SelectInput,
        width: "full",
        options: nationality_options,
      },
      {
        text: "Employee ID (if applicable)",
        name: "employeeID",
        component: TextInput,
        width: "1/2",
      },
      {
        text: "Contact number",
        component: TextInput,
        name: "phoneNumber",
        width: "full",
        type: "number",
      },
    ]}
  />
)

Step7.validationSchema = validation

export default Step7
