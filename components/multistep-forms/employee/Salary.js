import * as Yup from "yup"

import Questions from "../Questions"
import { NumberInput } from "../../../components/Input"

import progress2 from "../../../static/images/progress2.svg"

const validation = Yup.object().shape({
  annualSalary: Yup.number("Please enter a valid salary")
    .typeError("Please enter digits only in this box")
    .required("Required"),
})

const Salary = () => (
  <div>
    <Questions
      formWidth="60"
      title="Success! Let's start your loan application process."
      questions={[
        {
          text: "Please enter your annual salary",
          name: "annualSalary",
          component: NumberInput,
          currency: true,
          placeholder: "e.g. 20000",
        },
      ]}
    />
  </div>
)

Salary.validationSchema = validation
Salary.progressImg = progress2
Salary.componentName = "Salary"

export default Salary