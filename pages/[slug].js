import Head from "next/head"
import { useRouter } from "next/router"

import { useState, useEffect, Children } from "react"
import { Formik, Form } from "formik"
import styled from "styled-components"
import axios from "axios"

import Step1 from "./Step1Welcome"
import Step2 from "./Step2Eligibility"
import Step3 from "./Step3Verification"
import Step4 from "./Step4Loan"
import Step5 from "./Step5Accuracy"
import Step6 from "./Step6Personal"
import Step7 from "./Step7Personal"

const initialValues = {
  employmentStartDay: 0,
  employmentStartMonth: 0,
  employmentStartYear: 0,
  email: undefined,
  emailCode: undefined,
  permanentRole: false,
  loanAmount: 0,
  loanTerms: 0,
  firstName: "",
  lastName: "",
  dobDay: 0,
  dobMonth: 0,
  dobYear: 0,
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
  const [pageAmount, setPageAmount] = useState(children.length)

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

        return (
          <Container>
            <Header>
              <Logo />
            </Header>
            <StyledForm>
              {React.cloneElement(activePage, { setPage })}
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
