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
import { Button } from "../components/onboarding/styles"

import orangeLogo from "../static/logo_orange.svg"
import progress1 from "../static/images/progress1.svg"
import progress2 from "../static/images/progress2.svg"
import progress3 from "../static/images/progress3.svg"
import progress4 from "../static/images/progress4.svg"
import progress5 from "../static/images/progress5.svg"
import progressComplete from "../static/images/progressComplete.svg"

const progressImages = [
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

const Previous = ({ decrementPage }) => (
  <Button
    className="border border-teal w-40 bg-white text-teal"
    type="button"
    onClick={decrementPage}
  >
    Previous
  </Button>
)

const Submit = ({ isSubmitting }) => (
  <Button
    className="w-40 bg-teal text-white"
    type="submit"
    disabled={isSubmitting}
  >
    Submit
  </Button>
)

const Next = ({
  onClick,
  isValid,
  isSubmitting,
  formCompleted,
  submitForm: displayErrors,
}) => (
  <Button
    className="w-40 bg-teal text-white"
    type="button"
    onClick={isValid ? onClick : displayErrors}
    disabled={isSubmitting}
  >
    {formCompleted ? "Summary" : "Next"}
  </Button>
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
  pageAmount,
  setPage,
  isValid,
  isSubmitting,
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

  const nextClick = () => {
    switch (page) {
      case 2:
        return () => {
          createNewToken({ email: values.email })
          formCompleted ? goToSummary() : incrementPage()
        }
      case 3:
        return () => {
          isTokenValid({ token: values.token, email: values.email })
          incrementPage()
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

  return page === 1 ? (
    <section />
  ) : (
    <Section>
      <Previous {...{ decrementPage }} />
      <img src={progressImages[page - 2]} />
      {!lastPage ? (
        <Next
          {...{
            onClick: nextClick(),
            isValid,
            isSubmitting,
            formCompleted,
            submitForm,
          }}
        />
      ) : (
        <Submit {...{ isSubmitting }} />
      )}
    </Section>
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

const Footer = styled.div.attrs({ className: "w-full bg-white" })`
  transform: rotate(-180deg);
  box-shadow: 0 28px 34px 0 #f7f8fb;
`

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

const Section = styled.section.attrs({
  className: "flex w-full justify-between items-center px-10 py-6",
})`
  transform: rotate(180deg);
`

export default Onboarding
