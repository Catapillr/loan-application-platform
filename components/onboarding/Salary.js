import * as Yup from "yup"

import Questions from "./Questions"
import { NumberInput } from "../../components/Input"

import progress2 from "../../static/images/progress2.svg"

const validation = Yup.object().shape({
  salary: Yup.number("Please enter a valid number").required("Required"),
})

const Salary = () => (
  <div>
    <Questions
      formWidth="60"
      title="Success! Let's start your loan application process."
      questions={[
        {
          text: "Please enter your annual salary",
          name: "salary",
          component: NumberInput,
          placeholder: "e.g. 25000",
        },
      ]}
    />
  </div>
)

Salary.validationSchema = validation
Salary.progressImg = progress2

export default Salary