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
import DebugFormik from "../components/DebugFormik"

import orangeLogo from "../static/logo_orange.svg"

const initialValues = {
  employmentStartDate: { day: "", month: "", year: "" },
  email: "",
  emailCode: "",
  permanentRole: false,
  loanAmount: 0,
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

const Previous = ({ decrementPage }) => (
  <button type="button" onClick={decrementPage}>
    Previous
  </button>
)

const Submit = ({ isSubmitting }) => (
  <button type="submit" disabled={isSubmitting}>
    Submit
  </button>
)

const Next = ({
  onClick,
  isValid,
  isSubmitting,
  formCompleted,
  submitForm: displayErrors,
}) => (
  <button
    type="button"
    onClick={isValid ? onClick : displayErrors}
    disabled={isSubmitting}
  >
    {formCompleted ? "Summary" : "Next"}
  </button>
)

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
  isValid,
  isSubmitting,
  className,
  values,
  formCompleted,
  setFormCompleted,
  submitForm,
}) => {
  const lastPage = page === pageAmount

  const incrementPage = () => {
    if (page < pageAmount) {
      setPage(page + 1)
    }
  }

  const decrementPage = () => {
    if (page <= pageAmount && page > 1) {
      setPage(page - 1)
    }
  }

  const goToSummary = () => {
    setPage(pageAmount)
  }

  const nextClick = page => {
    switch (page) {
      case 2:
        return () => {
          createNewToken({ email: values.email })
          formCompleted ? goToSummary() : incrementPage()
        }
      case pageAmount - 1:
        return () => {
          setFormCompleted(true)
          incrementPage()
        }
      default:
        return formCompleted ? goToSummary : incrementPage
    }
  }

  return (
    <section className={className}>
      <Previous {...{ decrementPage }} />
      {!lastPage ? (
        <Next
          {...{
            onClick: nextClick(page),
            isValid,
            isSubmitting,
            formCompleted,
            submitForm,
          }}
        />
      ) : (
        <Submit {...{ isSubmitting }} />
      )}
    </section>
  )
}

const Wizard = ({ children, employer }) => {
  const [pageAmount] = useState(children.length)
  const [page, setPage] = useState(1)
  const [formCompleted, setFormCompleted] = useState(false)
  const activePage = React.Children.toArray(children)[page - 1]
  const { validationSchema } = activePage && activePage.type

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      validationSchema={validationSchema}
      onSubmit={() => {
        console.log("submitted") //eslint-disable-line no-console
      }}
    >
      {({
        isValid,
        isSubmitting,
        validateForm,
        values,
        submitForm,
        setTouched,
        errors,
        touched,
      }) => {
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
                  setTouched,
                  validateForm,
                  values,
                  errors,
                  touched,
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
                    isValid,
                    isSubmitting,
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

const Footer = styled.div``

const StyledForm = styled(Form).attrs({
  className: "",
})`
  width: 70%;
  min-height: 55vh;
  max-width: 860px;
`

const Logo = styled.img.attrs({
  src: orangeLogo,
})``

export default Onboarding
