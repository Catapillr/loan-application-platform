import Head from "next/head"
import { useRouter } from "next/router"

import { useState, useEffect, Children } from "react"
import { Formik, Form } from "formik"
import styled from "styled-components"
import axios from "axios"

import Step1 from "./onboarding/Step1"
import Step2 from "./onboarding/Step2"
import Step3 from "./onboarding/Step3"

const initialValues = {
  employmentStartDate: "",
  email: "",
  permanentRole: false,
  loanAmount: 0,
  loanTerms: 0,
  firstName: "",
  lastName: "",
  dobDay: 0,
  dobMonth: 0,
  dobYear: 0,
  nationality: "",
  employeeID: undefined,
  phoneNumber: "",
  confirmation: false,
  agreementStatus: "",
}

const Controls = ({ page, pageAmount, setPage, isDisabled, className }) => {
  const lastPage = page === pageAmount

  const incrementPage = () => {
    if (page < pageAmount) {
      return setPage(page + 1)
    }
  }

  const decrementPage = () => {
    if (page >= pageAmount && page > 0) {
      return setPage(page - 1)
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
  className: "w-2/6",
}))``

const Logo = styled.img.attrs(() => ({
  src: "/static/logo_orange.svg",
}))``

const Wizard = ({ children, employer }) => {
  const [page, setPage] = useState(1)
  const [pageAmount, setPageAmount] = useState(children.length)

  const activePage = children[page - 1]
  const { validationSchema } = activePage && activePage.type

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      validationSchema={validationSchema}
    >
      {({ isValid, isSubmitting }) => {
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
