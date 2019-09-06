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
import Step9 from "../components/onboarding/Step9Confirmation"
import DebugFormik from "../components/DebugFormik"
import { Button } from "../components/onboarding/styles"

import orangeLogo from "../static/logo_orange.svg"

// const initialValues = {
//   employmentStartDate: { day: "22", month: "02", year: "2018" },
//   email: "ivan@infactcoop.com",
//   token: "2342",
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

const initialValues = {
  employmentStartDate: { day: "", month: "", year: "" },
  email: "",
  token: "",
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

const Previous = ({ decrementPage, hidePrevious }) => (
  <div className="w-40">
    {!hidePrevious && (
      <Button
        className="border border-teal bg-white text-teal"
        type="button"
        onClick={decrementPage}
      >
        Previous
      </Button>
    )}
  </div>
)

const Submit = ({ isSubmitting, submitForm }) => (
  <Button
    className="w-40 bg-teal text-white"
    type="submit"
    disabled={isSubmitting}
    onClick={submitForm}
  >
    {isSubmitting ? "Submitting..." : "Submit"}
  </Button>
)

const Next = ({
  onClick,
  isValid,
  isSubmitting,
  formCompleted,
  submitForm: displayErrors,
  hideNext,
}) => (
  <div className="w-40">
    {!hideNext && (
      <Button
        className="bg-teal text-white"
        type="button"
        onClick={isValid ? onClick : displayErrors}
        disabled={isSubmitting}
      >
        {formCompleted ? "Summary" : "Next"}
      </Button>
    )}
  </div>
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

const isTokenValid = async ({ email, token }) => {
  const res = await axios(
    `${process.env.HOST}/api/is-token-valid?email=${email}&token=${token}`
  )

  const {
    data: { isTokenValid },
  } = res

  return { isTokenValid }
}

const Controls = ({
  page,
  isValid,
  isSubmitting,
  values,
  formCompleted,
  setFormCompleted,
  submitForm,
  setEmailVerificationError,
  shouldFormSubmit,
  hideNext,
  hidePrevious,
  progressImg,
  incrementPage,
  decrementPage,
  goToSummaryPage,
}) => {
  const nextClick = () => {
    switch (page) {
      case 2:
        return () => {
          createNewToken({ email: values.email })
          formCompleted ? goToSummaryPage() : incrementPage()
        }
      case 3:
        return async () => {
          const valid = await isTokenValid({
            token: values.token,
            email: values.email,
          })
          valid.isTokenValid ? incrementPage() : setEmailVerificationError(true)
        }

      case 7:
        return () => {
          setFormCompleted(true)
          incrementPage()
        }
      default:
        return formCompleted ? goToSummaryPage : incrementPage
    }
  }

  return (
    <ControlsSection {...{ hideNext, hidePrevious }}>
      <Previous {...{ decrementPage, hidePrevious }} />
      <img src={progressImg} />
      {shouldFormSubmit ? (
        <Submit {...{ isSubmitting, submitForm }} />
      ) : (
        <Next
          {...{
            onClick: nextClick(),
            isValid,
            isSubmitting,
            formCompleted,
            submitForm,
            hideNext,
          }}
        />
      )}
    </ControlsSection>
  )
}

const onSubmit = incrementPage => async ({
  firstName,
  lastName,
  loanTerms,
  loanAmount,
  email,
}) => {
  //eslint-disable-next-line no-console
  console.log("onboarding form submitted")
  try {
    await axios.post(`${process.env.HOST}/api/send-loan-agreement`, {
      name: `${firstName} ${lastName}`,
      loanTerms,
      loanAmount,
      email,
    })

    incrementPage()
  } catch (e) {
    // TODO: trigger submit error (maybe with toast error)

    //eslint-disable-next-line no-console
    console.error(
      "Loan agreement sending error",
      JSON.stringify(e, undefined, 2)
    )
  }
}

const Wizard = ({ children, employer }) => {
  const [page, setPage] = useState(1)
  const [formCompleted, setFormCompleted] = useState(false)
  const [emailVerificationError, setEmailVerificationError] = useState(false)
  const [summaryPage, setSummaryPage] = useState()

  const activePage = React.Children.toArray(children)[page - 1]
  const {
    validationSchema,
    shouldFormSubmit,
    hideNext,
    hidePrevious,
    progressImg,
    hideControls,
  } = activePage && activePage.type

  useEffect(() => {
    if (shouldFormSubmit) {
      setSummaryPage(page)
    }
  }, [page])

  const incrementPage = () => setPage(page + 1)
  const decrementPage = () => setPage(page - 1)
  const goToSummaryPage = () => setPage(summaryPage)

  return (
    <Formik
      {...{
        initialValues,
        validationSchema,
        onSubmit: onSubmit(incrementPage),
        enableReinitialize: false,
      }}
    >
      {({
        isValid,
        isSubmitting,
        validateForm,
        values,
        submitForm,
        setTouched,
      }) => {
        const debugging = false

        return (
          <Container>
            <Header>
              <Logo />
            </Header>
            <StyledForm>
              <RenderStep
                {...{
                  validateForm,
                  page,
                  setTouched,
                  component: React.cloneElement(activePage, {
                    setPage,
                    employer,
                    values,
                    emailVerificationError,
                  }),
                }}
              ></RenderStep>
            </StyledForm>
            <Footer>
              {!hideControls && (
                <Controls
                  {...{
                    page,
                    isValid,
                    isSubmitting,
                    values,
                    validateForm,
                    submitForm,
                    formCompleted,
                    setFormCompleted,
                    setEmailVerificationError,
                    shouldFormSubmit,
                    hideNext,
                    hidePrevious,
                    progressImg,
                    incrementPage,
                    decrementPage,
                    goToSummaryPage,
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
      <Step9 />
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

const Footer = styled.div.attrs({ className: "w-full bg-white" })`
  transform: rotate(-180deg);
  box-shadow: 0 28px 34px 0 #f7f8fb;
`

const StyledForm = styled(Form).attrs({
  className: "flex justify-center items-center",
})`
  width: 70%;
  min-height: 55vh;
  max-width: 860px;
`

const Logo = styled.img.attrs({
  src: orangeLogo,
})``

const ControlsSection = styled.section.attrs({
  className: `flex w-full justify-between items-center px-10 py-6`,
})`
  transform: rotate(180deg);
`

export default Onboarding
