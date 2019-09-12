import * as Yup from "yup"
import styled from "styled-components"

import Questions from "./Questions"
import { RangeInput, SelectInput } from "../../components/Input"

import progress2 from "../../static/images/progress2.svg"

// TODO: loan amount has to be sent in pennies to mangopay so needs to be stored in pennies
// i.e. for £3000 loan we have to send amount of 300000 : Int

const validation = Yup.object().shape({
  loanAmount: Yup.number()
    .moreThan(0, "Please choose a loan amount using the slider")
    .required("Required"),

  loanTerms: Yup.number().required("Required"),
})

const Divider = styled.div.attrs({
  className: "my-1",
})`
  height: 3px;
  background-color: ${cssTheme("colors.midgray")};
  width: 100%;
  opacity: 0.5;
`

const Step4 = ({ employer, values }) => {
  const serviceCharge1 = 182.5
  const serviceCharge2 = 69.99
  return (
    <div className="flex">
      <Questions
        values={values}
        formWidth="60"
        title="Success! Let's start your loan application process."
        questions={[
          {
            text: "How much would you like to borrow?",
            name: "loanAmount",
            component: RangeInput,
            type: "range",
            width: "full",
            max: employer.maximumAmount,
            min: 0,
          },
          {
            text: "How long would you like to pay it back over?",
            name: "loanTerms",
            options: ["Select months", 10, 12],
            type: "select",
            component: SelectInput,
            width: "5/6",
          },
        ]}
      />
      <div className="w-2/6">
        <div className="border border-midgray px-8 py-10">
          <p className="mb-4">
            For a loan of{" "}
            <span className="font-bold">£{values.loanAmount}</span>, to be paid
            back over{" "}
            <span className="font-bold">{values.loanTerms || 12} months</span>,
            your monthly repayment will be{" "}
            <span className="font-bold">£252.49</span>, and you will repay a{" "}
            <span className="font-bold">total of £2,852.49</span>
          </p>
          <div>
            <div className="flex justify-between mb-3">
              <p>Loan</p>
              <p>£{values.loanAmount}</p>
            </div>
            <div className="flex justify-between mb-3">
              <p>Service charge 1</p>
              <p>£{serviceCharge1}</p>
            </div>
            <div className="flex justify-between">
              <p>Service charge 2</p>
              <p>£{serviceCharge2}</p>
            </div>
          </div>
          <Divider />
          <p className="text-right">
            Total £{serviceCharge1 + serviceCharge2 + values.loanAmount}
          </p>
        </div>
      </div>
    </div>
  )
}

Step4.validationSchema = validation
Step4.progressImg = progress2

export default Step4
