import * as Yup from "yup"

import Questions from "./Questions"
import { RangeInput } from "../../components/Input"

const validation = Yup.object().shape({
  emailCode: Yup.string().required("Required"),
})

const Step4 = ({ employer, values }) => {
  return (
    <Questions
      values={values}
      title="Success! Let's start your loan application process."
      questions={[
        {
          text: "How much would you like to borrow?",
          name: "loanAmount",
          component: RangeInput,
          type: "range",
          width: "full",
          max: employer.maximumAmount,
        },
        {
          text: "How long would you like to pay it back over?",
          name: "loanTerms",
          options: [10, 11, 12],
          fieldType: "select",
        },
      ]}
    />
  )
}

Step4.validationSchema = validation

export default Step4
