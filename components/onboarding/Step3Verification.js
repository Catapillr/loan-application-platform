import * as Yup from "yup"

import Questions from "./Questions"
import { TextInput } from "../../components/Input"

const validation = Yup.object().shape({
  token: Yup.string()
    .min(1)
    .required("Required"),
})

const Step3 = () => (
  <Questions
    title="Thank you!"
    questions={[
      {
        text:
          "We've sent a verification code to your email address. Please check your email, and enter the code here:",
        name: "token",
        component: TextInput,
      },
    ]}
  />
)

Step3.validationSchema = validation

export default Step3
