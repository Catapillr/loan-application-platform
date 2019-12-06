import { useEffect } from "react"
import * as Yup from "yup"
import R_ from "../../../utils/R_.js"

import styled from "styled-components"

import Questions from "../Questions"

import { RangeInput, SelectInput, NumberInput } from "../../Input"

import progress2 from "../../../static/images/progress2.svg"

import penniesToPounds from "../../../utils/penniesToPounds"
import { formatToGBP, unformatFromGBP } from "../../../utils/currencyFormatter"
import keepFieldCleanOnChange from "../../../utils/keepFieldCleanOnChange"
import addThousandsSeperator from "../../../utils/addThousandsSeperator"

const validation = Yup.object().shape({
  loanAmount: Yup.string().required("Required"),

  loanTerms: Yup.number()
    .typeError("Please enter digits only in this box")
    .required("Required"),
})

const validateLoanAmount = (value, maxLoan) => {
  let error

  if (unformatFromGBP(value) <= 0) {
    error = "Please choose a loan amount"
  }

  if (unformatFromGBP(value) > maxLoan) {
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
    unformatFromGBP(annualSalary) * maxSalaryPercentage * 0.01,
    penniesToPounds(maximumAmount)
  ).toFixed(0)

  const monthlyRepayment = Math.floor(loanAmount / (loanTerms || 11))
  const remainder = loanAmount % (loanTerms || 11)
  const firstMonth = monthlyRepayment + remainder

  useEffect(() => {
    setFieldValue("loanAmount", maxLoan)
    setFieldValue("loanAmountBox", formatToGBP(maxLoan))
  }, [])

  return (
    <div className="flex">
      <Questions
        values={values}
        formWidth="60"
        title="Please now select the loan amount required"
        subheader="The maximum amount you can borrow has been calculated in the box below. You can either keep this amount or use the slider to select the loan you require. "
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
            onChange: e => {
              setFieldValue("loanAmount", e.target.value)
              setFieldValue("loanAmountBox", formatToGBP(e.target.value))
            },
            validate: value => validateLoanAmount(value, maxLoan),
          },
          {
            name: "loanAmountBox",
            component: NumberInput,
            currency: true,
            onBlur: e => {
              setFieldValue("loanAmountBox", formatToGBP(e.target.value))
              setFieldValue("loanAmount", unformatFromGBP(e.target.value))
            },
            onInput: e => {
              setFieldValue("loanAmountBox", formatToGBP(e.target.value))
              setFieldValue("loanAmount", unformatFromGBP(e.target.value))
            },
            width: "full",
            max: maxLoan,
            min: 0,
            validate: value => validateLoanAmount(value, maxLoan),
          },
          {
            text: "How long would you like to pay it back over?",
            name: "loanTerms",
            options: R_.mapIndexed((_, index) => ({
              label: index + 1,
              value: index + 1,
            }))([...Array(11)]),
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
              <p>{formatToGBP(loanAmount)}</p>
            </div>{" "}
            <div className="flex justify-between mb-3">
              <p>Repayment months:</p>
              <p>{loanTerms || 11}</p>
            </div>{" "}
            <div className="flex justify-between mb-3">
              <p>First month:</p>
              <p>{formatToGBP(firstMonth)}</p>
            </div>{" "}
            <div className="flex justify-between mb-3">
              <p>Repayment per month:</p>
              <p>{formatToGBP(monthlyRepayment)}</p>
            </div>
          </div>
          <Divider />
          <p className="text-right">Total {formatToGBP(loanAmount)}</p>
        </div>
        <p>
          If you have any questions, please check out our{" "}
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
