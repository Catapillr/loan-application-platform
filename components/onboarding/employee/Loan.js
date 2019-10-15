import { useEffect } from "react"
import * as Yup from "yup"
import styled from "styled-components"

import Questions from "../Questions"
import { RangeInput, SelectInput, NumberInput } from "../../Input"

import progress2 from "../../../static/images/progress2.svg"

import penniesToPounds from "../../../utils/penniesToPounds"

const validation = Yup.object().shape({
  loanAmount: Yup.number()
    .typeError("Please enter digits only in this box")
    .moreThan(0, "Please choose a loan amount using the slider")
    .required("Required"),

  loanTerms: Yup.number()
    .typeError("Please enter digits only in this box")
    .required("Required"),
})

const validateLoanAmount = (value, maxLoan) => {
  let error
  if (value > maxLoan) {
    error = "Sorry, you can't borrow that much"
  }

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

const Loan = ({
  employer: { maxSalaryPercentage, maximumAmount },
  values,
  setFieldValue,
}) => {
  const { annualSalary, loanAmount, loanTerms } = values
  const maxLoan = Math.min(
    annualSalary * maxSalaryPercentage * 0.01,
    penniesToPounds(maximumAmount)
  )
  const monthlyRepayment = (loanAmount / (loanTerms || 12)).toFixed(2)

  useEffect(() => {
    setFieldValue("loanAmount", maxLoan)
  }, [])

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
            step: 5,
            validate: value => validateLoanAmount(value, maxLoan),
          },
          {
            name: "loanAmount",
            component: NumberInput,
            width: "full",
            max: maxLoan,
            min: 0,
            validate: value => validateLoanAmount(value, maxLoan),
          },
          {
            text: "How long would you like to pay it back over?",
            name: "loanTerms",
            options: [{ label: 10, value: 10 }, { label: 12, value: 12 }],
            placeholder: "Select months",
            type: "select",
            component: SelectInput,
            width: "5/6",
          },
        ]}
      />
      <div className="w-2/6 flex flex-col">
        <div className="border border-midgray px-8 py-10 mb-2">
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
        <p>
          Have more questions? Why not check out our{" "}
          <a
            href="https://catapillr.com/faq/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal underline"
          >
            FAQ page
          </a>
          .
        </p>
      </div>
    </div>
  )
}

Loan.validationSchema = validation
Loan.progressImg = progress2
Loan.componentName = "Loan"

export default Loan
