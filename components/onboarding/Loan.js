import * as Yup from "yup"
import styled from "styled-components"

import Questions from "./Questions"
import { RangeInput, SelectInput } from "../Input"

import progress2 from "../../static/images/progress2.svg"

// TODO: loan amount has to be sent in pennies to mangopay so needs to be stored in pennies
// i.e. for £3000 loan we have to send amount of 300000 : Int

const validation = Yup.object().shape({
  loanAmount: Yup.number()
    .moreThan(0, "Please choose a loan amount using the slider")
    .required("Required"),

  loanTerms: Yup.number().required("Required"),
})

const validateLoanAmount = (value, maxLoan) => {
  let error
  if (value > maxLoan) {
    error = "Sorry, you can't borrow that much"
  }
  console.log("in validate", error)

  return error
}

const Divider = styled.div.attrs({
  className: "my-1",
})`
  height: 3px;
  background-color: ${cssTheme("colors.midgray")};
  width: 100%;
  opacity: 0.5;
`

const Loan = ({ employer: { maxSalaryPercentage, maximumAmount }, values }) => {
  const { salary, loanAmount, loanTerms } = values
  const maxLoan = Math.min(salary * maxSalaryPercentage * 0.01, maximumAmount)
  const monthlyRepayment = (loanAmount / (loanTerms || 12)).toFixed(2)

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
            max: maxLoan,
            min: 0,
            validate: validateLoanAmount(maxLoan),
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
          <p className="mb-4 bold underline">Summary</p>
          <div>
            <div className="flex justify-between mb-3">
              <p>Loan:</p>
              <p>£{loanAmount}</p>
            </div>{" "}
            <div className="flex justify-between mb-3">
              <p>Repayment months:</p>
              <p>{loanTerms || 12}</p>
            </div>{" "}
            <div className="flex justify-between mb-3">
              <p>Repayment per month:</p>
              <p>£{monthlyRepayment}</p>
            </div>
          </div>
          <Divider />
          <p className="text-right">Total £{loanAmount}</p>
        </div>
      </div>
    </div>
  )
}

Loan.validationSchema = validation
Loan.progressImg = progress2

export default Loan
