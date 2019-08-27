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

const StyledForm = styled(Form).attrs(() => ({
  className: "bg-white",
}))`
  width: 90%;
  height: 90%;
`

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
          <StyledForm>
            {activePage}
            <Controls
              page={page}
              pageAmount={pageAmount}
              setPage={setPage}
              isDisabled={isDisabled}
            />
          </StyledForm>
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
