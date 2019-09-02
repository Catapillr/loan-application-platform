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

// const initialValues = {
//   employmentStartDate: { day: "", month: "", year: "" },
//   email: "",
//   emailCode: "",
//   permanentRole: false,
//   loanAmount: "",
//   loanTerms: "",
//   firstName: "",
//   lastName: "",
//   dob: { day: "", month: "", year: "" },
//   nationality: "",
//   employeeID: "",
//   phoneNumber: "",
//   confirmation: false,
//   agreementStatus: "",
// }

const initialValues = {
  employmentStartDate: { day: "22", month: "02", year: "2018" },
  email: "ivan@infactcoop.com",
  emailCode: "23234",
  permanentRole: true,
  loanAmount: "234",
  loanTerms: "10",
  firstName: "Ivan",
  lastName: "Gonzalez",
  dob: { day: "23", month: "03", year: "1989" },
  nationality: "Colombian",
  employeeID: "24",
  phoneNumber: "834729743972",
  confirmation: false,
  agreementStatus: "",
}

const Previous = ({ decrementPage }) => (
  <button type="button" onClick={decrementPage}>
    Previous
  </button>
)

const Submit = ({ isDisabled }) => (
  <button type="submit" disabled={isDisabled}>
    Submit
  </button>
)

const Next = ({ incrementPage, isDisabled, values, setPage, pageAmount }) =>
  values.nationality ? (
    <button
      type="button"
      onClick={() => setPage(pageAmount)}
      disabled={isDisabled}
    >
      Summary
    </button>
  ) : (
    <button type="button" onClick={incrementPage} disabled={isDisabled}>
      Next
    </button>
  )

const Controls = ({
  page,
  pageAmount,
  setPage,
  isDisabled,
  className,
  values,
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

  return (
    <section className={className}>
      <Previous {...{ decrementPage }} />
      {!lastPage && (
        <Next {...{ incrementPage, isDisabled, values, setPage, pageAmount }} />
      )}
      {lastPage && <Submit {...{ isDisabled }} />}
    </section>
  )
}

const Footer = styled.div.attrs({})``

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
  const [pageAmount] = useState(children.length)

  const activePage = React.Children.toArray(children)[page - 1]
  const { validationSchema } = activePage && activePage.type
  console.log(validationSchema)

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      validationSchema={validationSchema}
      isInitialValid={true}
    >
      {form => {
        const { isValid, isSubmitting, validateForm, values } = form
        // console.log("values", values)
        const isDisabled = !isValid || isSubmitting
        console.log("isValid", isValid)
        console.log("errors", form.errors)
        // console.log("page", page, "pageAmount", pageAmount)

        const debugging = true

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
              ></RenderStep>
              <button type="button" onClick={validateForm}>
                Validate
              </button>
            </StyledForm>
            <Footer>
              <Controls
                page={page}
                pageAmount={pageAmount}
                setPage={setPage}
                isDisabled={isDisabled}
                values={values}
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

const RenderStep = ({ component, validateForm, page }) => {
  useEffect(() => {
    console.log("validating form")
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
