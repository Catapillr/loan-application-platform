import React, { useState, useEffect } from "react"
import { Formik, Form, Field } from "formik"
import styled from "styled-components"
import axios from "axios"

import Step1 from "../components/onboarding/Step1Welcome"
import Step2 from "../components/onboarding/Step2Eligibility"
import Step3 from "../components/onboarding/Step3Verification"
import Step4 from "../components/onboarding/Step4Loan"
import Step5 from "../components/onboarding/Step5Accuracy"
import Step6 from "../components/onboarding/Step6Personal"
import Step7 from "../components/onboarding/Step7Personal"
import Step8 from "../components/onboarding/Step8Summary"

import progress1 from "../static/images/progress1.svg"
import progress2 from "../static/images/progress2.svg"
import progress3 from "../static/images/progress3.svg"
import progress4 from "../static/images/progress4.svg"
import progress5 from "../static/images/progress5.svg"
import progressComplete from "../static/images/progressComplete.svg"

import { Button } from "../components/onboarding/styles"

import DebugFormik from "../components/DebugFormik"

const initialValues = {
  employmentStartDate: { day: "", month: "", year: "" },
  email: "",
  emailCode: "",
  permanentRole: false,
  loanAmount: "",
  loanTerms: "",
  firstName: "",
  lastName: "",
  dob: { day: "", month: "", year: "" },
  nationality: "",
  employeeID: "",
  phoneNumber: "",
  confirmation: false,
  agreementStatus: "",
}

// const initialValues = {
//   employmentStartDate: { day: "22", month: "02", year: "2018" },
//   email: "ivan@infactcoop.com",
//   emailCode: "23234",
//   permanentRole: true,
//   loanAmount: "234",
//   loanTerms: "10",
//   firstName: "Ivan",
//   lastName: "Gonzalez",
//   dob: { day: "23", month: "03", year: "1989" },
//   nationality: "Colombian",
//   employeeID: "24",
//   phoneNumber: "834729743972",
//   confirmation: false,
//   agreementStatus: "",
// }

const Previous = ({ decrementPage }) => (
  <Button
    className="border border-teal w-40 bg-white text-teal"
    type="button"
    onClick={decrementPage}
  >
    Previous
  </Button>
)

const Submit = ({ isDisabled }) => (
  <Button
    className="w-40 bg-teal text-white"
    type="submit"
    disabled={isDisabled}
  >
    Submit
  </Button>
)

const Next = ({ onClick, isDisabled, formCompleted, submitForm }) => (
  <Button
    className="w-40 bg-teal text-white"
    type="button"
    onClick={isDisabled ? submitForm : onClick}
  >
    {formCompleted ? "Summary" : "Next"}
  </Button>
)

const Section = styled.section.attrs({
  className: "flex w-full justify-between items-center px-10 py-6",
})`
  transform: rotate(180deg);
`

const createNewToken = async ({ email }) => {
  const res = await axios.post(`${process.env.HOST}/api/create-new-token`, {
    email,
  })

  const {
    data: { token },
  } = res

  return { token }
}

const Controls = ({
  page,
  pageAmount,
  setPage,
  isDisabled,
  values,
  formCompleted,
  setFormCompleted,
  submitForm,
}) => {
  const lastPage = page === pageAmount

  const nextClick = page => {
    switch (page) {
      case 2:
        return () => {
          createNewToken({ email: values.email })
          return incrementPage()
        }
      case 7:
        return () => {
          setFormCompleted(true)
          return incrementPage()
        }
      default:
        return formCompleted ? incrementLastPage : submitForm
    }
  }

  const incrementPage = () => {
    if (page < pageAmount) {
      setPage(page + 1)
    }
  }

  const incrementLastPage = () => setPage(pageAmount)

  const decrementPage = () => {
    if (page <= pageAmount && page > 1) {
      setPage(page - 1)
    }
  }

  const progressImage = [
    progress1,
    progress1,
    progress2,
    progress2,
    progress3,
    progress3,
    progress4,
    progress5,
    progressComplete,
  ]

  return page === 1 ? (
    <section />
  ) : (
    <Section>
      <Previous {...{ decrementPage }} />
      <img src={progressImage[page - 2]} />

      {!lastPage && (
        <Next
          {...{
            onClick: nextClick(page),
            isDisabled,
            formCompleted,
            submitForm,
          }}
        />
      )}
      {lastPage && <Submit {...{ isDisabled }} />}
    </Section>
  )
}

const Footer = styled.div.attrs({ className: "w-full bg-white" })`
  transform: rotate(-180deg);
  box-shadow: 0 28px 34px 0 #f7f8fb;
`

const Container = styled.div.attrs({
  className: "bg-white flex flex-col items-center justify-between",
})`
  width: 90%;
  height: 90%;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const Header = styled.div.attrs({
  className: "pl-10 pt-8 w-full",
})``
const StyledForm = styled(Form).attrs({
  className: "",
})`
  width: 70%;
  max-width: 800px;
`

const Logo = styled.img.attrs({
  src: "/static/logo_orange.svg",
})``

const Wizard = ({ children, employer }) => {
  const [page, setPage] = useState(1)
  const [formCompleted, setFormCompleted] = useState(false)
  const [pageAmount] = useState(children.length)
  const activePage = React.Children.toArray(children)[page - 1]
  const { validationSchema } = activePage && activePage.type

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      validationSchema={validationSchema}
    >
      {form => {
        const {
          isValid,
          isSubmitting,
          validateForm,
          values,
          submitForm,
          setTouched,
        } = form
        const isDisabled = !isValid || isSubmitting

        const debugging = false

        return (
          <Container>
            <Header>
              <Logo />
            </Header>
            <StyledForm>
              <RenderStep
                component={React.cloneElement(activePage, {
                  setPage,
                  employer,
                  ...form,
                })}
                validateForm={validateForm}
                page={page}
                setTouched={setTouched}
              ></RenderStep>
            </StyledForm>
            <Footer>
              {page !== 1 && (
                <Controls
                  {...{
                    page,
                    pageAmount,
                    setPage,
                    isDisabled,
                    values,
                    validateForm,
                    submitForm,
                    formCompleted,
                    setFormCompleted,
                  }}
                />
              )}
            </Footer>
            {debugging && (
              <Field>
                {({ field }) => (
                  <DebugFormik title="Stored Formik values">
                    {JSON.stringify(field.value, null, 2)}
                  </DebugFormik>
                )}
              </Field>
            )}
          </Container>
        )
      }}
    </Formik>
  )
}

const RenderStep = ({ component, validateForm, page, setTouched }) => {
  useEffect(() => {
    setTouched({})
    validateForm()
  }, [page])

  return <>{component}</>
}

const Onboarding = ({ employer }) => {
  return (
    <Wizard employer={employer}>
      <Step1 />
      <Step2 />
      <Step3 />
      <Step4 />
      <Step5 />
      <Step6 />
      <Step7 />
      <Step8 />
    </Wizard>
  )
}

Onboarding.getInitialProps = async ({ req }) => {
  const slug = req.originalUrl.slice(1)
  const res = await axios(
    `${process.env.HOST}/api/get-employer-from-slug?${slug}`
  )

  const {
    data: { employer },
  } = res
  return { employer }
}

export default Onboarding
