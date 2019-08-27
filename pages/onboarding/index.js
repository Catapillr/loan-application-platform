import { useState, Children } from "react"
import { Formik, Form } from "formik"
import styled from "styled-components"

import Step1 from "./Step1"
import Step2 from "./Step2"

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

const Controls = ({ page, pageAmount, setPage, isDisabled }) => {
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

  return (
    <section>
      <Previous />
      {!lastPage && <Next />}
      {lastPage && <Submit />}
    </section>
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

const Wizard = ({ children }) => {
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
              {activePage}
              <Controls
                page={page}
                pageAmount={pageAmount}
                setPage={setPage}
                isDisabled={isDisabled}
              />
            </StyledForm>
            <Footer></Footer>
          </Container>
        )
      }}
    </Formik>
  )
}

const Onboarding = () => (
  <Wizard>
    <Step1 />
    <Step2 />
  </Wizard>
)
export default Onboarding
