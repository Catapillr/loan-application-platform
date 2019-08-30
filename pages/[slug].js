import React, { useState, Children } from "react"
import { Formik, Form, Field } from "formik"
import styled from "styled-components"
import axios from "axios"

import Step1 from "./onboarding/Step1Welcome"
import Step2 from "./onboarding/Step2Eligibility"
import Step3 from "./onboarding/Step3Verification"
import Step4 from "./onboarding/Step4Loan"
import Step5 from "./onboarding/Step5Accuracy"
import Step6 from "./onboarding/Step6Personal"
import Step7 from "./onboarding/Step7Personal"

import DebugFormik from "../components/DebugFormik"

const initialValues = {
  employmentStartDay: "",
  employmentStartMonth: "",
  employmentStartYear: "",
  email: "",
  emailCode: "",
  permanentRole: false,
  loanAmount: "",
  loanTerms: "",
  firstName: "",
  lastName: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  nationality: "",
  employeeID: "",
  phoneNumber: "",
  confirmation: false,
  agreementStatus: "",
}

const Controls = ({
  page,
  pageAmount,
  setPage,
  isDisabled,
  className,
  validateForm,
}) => {
  const lastPage = page === pageAmount

  const incrementPage = () => {
    if (page < pageAmount) {
      setPage(page + 1)
      return validateForm()
    }
  }
  const decrementPage = () => {
    if (page <= pageAmount && page > 1) {
      setPage(page - 1)
      return validateForm()
    }
  }

  const Previous = () => (
    <button type="button" onClick={decrementPage}>
      Previous
    </button>
  )

  const Submit = () => <button disabled={isDisabled}>Submit</button>

  const Next = () => (
    <button type="button" onMouseDown={incrementPage} disabled={isDisabled}>
      Next
    </button>
  )

  const ControlsContainer = styled.section.attrs(() => ({
    className: `${className}`,
  }))``

  return (
    <ControlsContainer>
      <Previous />
      {!lastPage && <Next />}
      {lastPage && <Submit />}
    </ControlsContainer>
  )
}

const Footer = styled.div.attrs(() => ({}))``

const Container = styled.div.attrs(() => ({
  className: "bg-white flex flex-col items-center justify-between",
}))`
  width: 90%;
  height: 90%;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const Header = styled.div.attrs(() => ({
  className: "pl-10 pt-8 w-full",
}))``
const StyledForm = styled(Form).attrs(() => ({
  className: "",
}))``

const Logo = styled.img.attrs(() => ({
  src: "/static/logo_orange.svg",
}))``

const Wizard = ({ children, employer }) => {
  const [page, setPage] = useState(1)
  const [pageAmount, setPageAmount] = useState(children.length) //eslint-disable-line

  const activePage = Children.toArray(children)[page - 1]
  const { validationSchema } = activePage && activePage.type

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      validationSchema={validationSchema}
    >
      {({ isValid, isSubmitting, validateForm }) => {
        const isDisabled = !isValid || isSubmitting

        const debugging = false

        return (
          <Container>
            <Header>
              <Logo />
            </Header>
            <StyledForm>
              {React.cloneElement(activePage, { setPage, employer })}
            </StyledForm>
            <Footer>
              <Controls
                page={page}
                pageAmount={pageAmount}
                setPage={setPage}
                isDisabled={isDisabled}
                validateForm={validateForm}
              />
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
    </Wizard>
  )
}

Onboarding.getInitialProps = async ({ req }) => {
  const slug = req.originalUrl.slice(1)
  const res = await axios(
    `http://localhost:3000/api/get-employer-from-slug?${slug}`
  )

  const {
    data: { employer },
  } = res
  return { employer }
}

export default Onboarding
