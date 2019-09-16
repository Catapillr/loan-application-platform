import * as Yup from "yup"

import Questions from "./Questions"
import { TextInput } from "../Input"

import progress2 from "../../static/images/progress2.svg"

const validation = Yup.object().shape({
  token: Yup.string()
    .min(1)
    .required("Required"),
})

const Verification = ({ emailVerificationError }) => (
  <div>
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
    {emailVerificationError && (
      <p className="w-1/2 m-auto text-red">
        That code isn't valid! Please double check it. Verification codes are
        only valid for 24 hours, so you might have to start again if you've left
        it too long.
      </p>
    )}
  </div>
)

Verification.validationSchema = validation
Verification.progressImg = progress2

export default Verification
