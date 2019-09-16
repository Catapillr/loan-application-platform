import * as Yup from "yup"

import Questions from "./Questions"
import { TextInput, SelectInput } from "../Input"

import progress4 from "../../static/images/progress4.svg"

import nationalityOptions from "./nationalityOptions"

const validation = Yup.object().shape({
  nationality: Yup.string().required("Required"),
  phoneNumber: Yup.string()
    .required("Required")
    .min(10, "Please enter a valid phone number")
    .max(15, "Please enter a valid phone number"),
})

const Contact = () => (
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
        options: nationalityOptions,
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
        placeholder: "e.g. 07565111222",
      },
    ]}
  />
)

Contact.validationSchema = validation
Contact.progressImg = progress4

export default Contact
