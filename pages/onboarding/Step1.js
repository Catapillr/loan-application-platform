import * as Yup from "yup" //eslint-disable-line
import StepTemplate from "./_StepTemplate"

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

const Step1 = () => (
  <StepTemplate
    title="We need a few details from you to verify that you are eligible"
    questions={[
      {
        text: "When did you start working for your employer?",
        dateInputNames: ["dobDay", "dobMonth", "dobYear"],
        component: {},
        name: "dob",
      },
      {
        text: "Please enter your work email:",
        name: "email",
        component: {},
        className: "",
        width: "full",
      },
      {
        text: "I confirm that my current role is permanent:",
        name: "permanentRole",
        component: {},
        className: "",
        fieldType: "checkbox",
        width: "full",
      },
    ]}
  />
)

Step1.validationSchema = validation

export default Step1
