import React, { useState, useEffect } from "react"
import { Formik, Form, Field } from "formik"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import styled from "styled-components"
import axios from "axios"
import * as R from "ramda"

import * as Steps from "../components/onboarding/stepNames"

import Welcome from "../components/onboarding/Welcome"
import Eligibility from "../components/onboarding/Eligibility"
import Verification from "../components/onboarding/Verification"
import Salary from "../components/onboarding/Salary"
import Loan from "../components/onboarding/Loan"
import Accuracy from "../components/onboarding/Accuracy"
import Personal from "../components/onboarding/Personal"
import Contact from "../components/onboarding/Contact"
import Summary from "../components/onboarding/Summary"
import Confirmation from "../components/onboarding/Confirmation"

import DebugFormik from "../components/DebugFormik"
import { Button } from "../components/onboarding/styles"

import orangeLogo from "../static/logo_orange.svg"

const initialValues = {
  employmentStartDate: {
    day: 1,
    month: 1,
    year: 2018,
  },
  email: "ivangonzalez@infactcoop.com",
  token: "e214fdc7b766",
  permanentRole: true,
  salary: 10000,
  loanAmount: 965,
  loanTerms: "12",
  firstName: "Ivan",
  lastName: "Gonzalez",
  dob: {
    day: 23,
    month: 3,
    year: 1989,
  },
  nationality: "Colombian",
  employeeID: "8sdj98sd",
  phoneNumber: "07443998236",
  confirmation: false,
}

// const initialValues = {
//   employmentStartDate: { day: "", month: "", year: "" },
//   email: "",
//   token: "",
//   permanentRole: false,
//   salary: "",
//   loanAmount: 0,
//   loanTerms: "",
//   firstName: "",
//   lastName: "",
//   dob: { day: "", month: "", year: "" },
//   nationality: "",
//   employeeID: "",
//   phoneNumber: "",
//   confirmation: false,
// }

const Previous = ({ decrementPage, hidePrevious }) => (
  <div className="w-40">
    {!hidePrevious && (
      <Button
        className="border border-teal bg-white text-teal w-full"
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
        className="bg-teal text-white w-full"
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
  hideNext,
  hidePrevious,
  progressImg,
  incrementPage,
  decrementPage,
  goToSummaryPage,
}) => {
  const nextClick = () => {
    switch (page) {
      case Steps.Eligibility:
        return () => {
          createNewToken({ email: values.email })
          formCompleted ? goToSummaryPage() : incrementPage()
        }

      case Steps.Verification:
        return async () => {
          const valid = await isTokenValid({
            token: values.token,
            email: values.email,
          })
          valid.isTokenValid ? incrementPage() : setEmailVerificationError(true)
        }

      case Steps.Contact:
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
      <Previous {...{ page, decrementPage, hidePrevious }} />
      <img src={progressImg} />
      {page === Steps.Summary ? (
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

const onSubmit = ({ incrementPage, employer }) => async values => {
  //eslint-disable-next-line no-console
  console.log("onboarding form submitted")
  try {
    await axios.post(`${process.env.HOST}/api/send-loan-agreement`, {
      employer,
      ...values,
      phoneNumber: parsePhoneNumberFromString(values.phoneNumber).number,
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
  const [page, setPage] = useState(Steps.Welcome)
  const [formCompleted, setFormCompleted] = useState(false)
  const [emailVerificationError, setEmailVerificationError] = useState(false)

  const steps = React.Children.toArray(children)
  const pages = steps.map(step => step.type.name)
  const activePage = R.find(R.pathEq(["type", "name"], page))(steps)

  const {
    validationSchema,
    hideNext,
    hidePrevious,
    progressImg,
    hideControls,
  } = activePage && activePage.type

  const incrementPage = () => {
    const pageIndex = R.findIndex(R.equals(page))(pages)
    setPage(pages[pageIndex + 1])
  }

  const decrementPage = () => {
    const pageIndex = R.findIndex(R.equals(page))(pages)
    setPage(pages[pageIndex - 1])
  }

  const goToSummaryPage = () => setPage(Steps.Summary)

  return (
    <Formik
      {...{
        initialValues,
        validationSchema,
        onSubmit: onSubmit({ incrementPage, employer }),
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
        const debugging = true

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
                    incrementPage,
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
      <Welcome />
      <Eligibility />
      <Verification />
      <Salary />
      <Loan />
      <Accuracy />
      <Personal />
      <Contact />
      <Summary />
      <Confirmation />
    </Wizard>
  )
}

Onboarding.getInitialProps = async ({ req }) => {
  const slug = req.originalUrl.slice(1)
  const res = await axios(
    `${process.env.HOST}/api/get-employer-from-slug?slug=${slug}`
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
  min-height: -webkit-fill-available;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const Header = styled.div.attrs({
  className: "pl-10 pt-8  w-full",
})``

const Footer = styled.div.attrs({ className: "w-full bg-white" })`
  transform: rotate(-180deg);
  box-shadow: 0 28px 34px 0 #f7f8fb;
`

const StyledForm = styled(Form).attrs({
  className: "pt-10 pb-20 flex justify-center items-center",
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
