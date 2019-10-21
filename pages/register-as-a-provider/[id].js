import React, { useState, useEffect } from "react"
import { Formik, Form, Field } from "formik"
import styled from "styled-components"
import axios from "axios"
import * as R from "ramda"

import * as Steps from "../../components/onboarding/register-as-a-provider/stepNames"
import getLastPath from "../../utils/getLastPath"
import createFormData from "../../utils/createFormData"

import Welcome from "../../components/onboarding/register-as-a-provider/Welcome"
import BusinessDetails from "../../components/onboarding/register-as-a-provider/BusinessDetails"
import UBOs from "../../components/onboarding/register-as-a-provider/UBOs"
import BankDetails from "../../components/onboarding/register-as-a-provider/BankDetails"
import Documents from "../../components/onboarding/register-as-a-provider/Documents"
import Summary from "../../components/onboarding/register-as-a-provider/Summary"
import Confirmation from "../../components/onboarding/register-as-a-provider/Confirmation"

import DebugFormik from "../../components/DebugFormik"
import { Button } from "../../components/onboarding/styles"

import orangeLogo from "../../static/logo_orange.svg"

// const initialValues = {
//   businessName: "",
//   businessEmail: "",
//   companyNumber: "",
//   repFirstName: "",
//   repLastName: "",
//   repDob: { day: "", month: "", year: "" },
//   repCountryOfResidence: "GB",
//   repNationality: "GB",
//   repProofOfId: {
//     name: "",
//     lastModified: "",
//     lastModifiedDate: "",
//     webkitRelativePath: "",
//   },
//   articlesOfAssociation: {
//     name: "",
//     lastModified: "",
//     lastModifiedDate: "",
//     webkitRelativePath: "",
//   },
//   proofOfRegistration: {
//     name: "",
//     lastModified: "",
//     lastModifiedDate: "",
//     webkitRelativePath: "",
//   },
//   bankName: "",
//   accountNumber: "",
//   sortCode: {
//     firstSection: "",
//     secondSection: "",
//     thirdSection: "",
//   },
//   AddressLine1: "",
//   AddressLine2: "",
//   City: "",
//   Region: "",
//   PostalCode: "",
//   Country: "",
// }

const initialValues = {
  businessName: "InFact",
  businessEmail: "hello@infactcoop.com",
  companyNumber: "11912270",
  repFirstName: "Maximus",
  repLastName: "Gerber",
  repDob: { day: "17", month: "03", year: "1992" },
  repCountryOfResidence: "GB",
  repNationality: "GB",
  repProofOfId: {},
  articlesOfAssociation: {},
  proofOfRegistration: {},
  repProofOfIdURI: "",
  articlesOfAssociationURI: "",
  proofOfRegistrationURI: "",
  bankName: "Monzo",
  accountNumber: "17918586",
  sortCode: {
    firstSection: "23",
    secondSection: "69",
    thirdSection: "72",
  },
  AddressLine1: "Space4",
  AddressLine2: "149 Fonthill Road",
  City: "London",
  Region: "London",
  PostalCode: "N4 3HF",
  Country: "GB",
}

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

const Controls = ({
  page,
  isValid,
  isSubmitting,
  // values,
  formCompleted,
  setFormCompleted,
  submitForm,
  // setEmailVerificationError,
  hideNext,
  hidePrevious,
  progressImg,
  incrementPage,
  decrementPage,
  goToSummaryPage,
}) => {
  const nextClick = () => {
    switch (page) {
      case Steps.BankDetails:
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

const onSubmit = ({
  incrementPage,
  childcareProviderEmail,
  formCompleted,
}) => async values => {
  try {
    //eslint-disable-next-line no-console
    console.log("Register-as-a-provider form submitted")

    if (!formCompleted) incrementPage()

    const form = createFormData({
      ...values,
      childcareProviderEmail,
    })

    axios.post("/api/register-provider", form)

    incrementPage()
  } catch (e) {
    // TODO: trigger submit error (maybe with toast error)

    //eslint-disable-next-line no-console
    console.error("Loan agreement sending error", e)
  }
}

const Wizard = ({
  children,
  paymentRequest,
  childcareProvider,
  user,
  company,
}) => {
  const [page, setPage] = useState(Steps.Welcome)
  const [formCompleted, setFormCompleted] = useState(false)
  const [emailVerificationError, setEmailVerificationError] = useState(false)

  const steps = React.Children.toArray(children)
  const pages = steps.map(step => step.type.componentName)
  const activePage = R.find(R.pathEq(["type", "componentName"], page))(steps)

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
        initialValues: { ...initialValues, ...company },
        validationSchema,
        onSubmit: onSubmit({
          incrementPage,
          paymentRequest,
          childcareProviderEmail: childcareProvider.email,
        }),
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
        setFieldValue,
      }) => {
        const debugging = false

        return (
          <Container>
            <Header activeHref="make-a-payment">
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
                    paymentRequest,
                    childcareProvider,
                    user,
                    values,
                    emailVerificationError,
                    incrementPage,
                    setFieldValue,
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

const ProviderOnboarding = ({
  paymentRequest,
  childcareProvider,
  user,
  company,
  error,
}) => {
  if (error) {
    return <ErrorDiv>{error}</ErrorDiv>
  }

  return (
    <Wizard {...{ paymentRequest, childcareProvider, user, company }}>
      <Welcome />
      <BusinessDetails />
      <UBOs />
      <Documents />
      <BankDetails />
      <Summary />
      <Confirmation />
    </Wizard>
  )
}

const Container = styled.div.attrs({
  className: "bg-white flex flex-col items-center justify-between",
})`
  width: 90%;
  min-height: -webkit-fill-available;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
  margin: 50px 0;
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

const ErrorDiv = styled.div.attrs({
  className: "w-auto block bg-white px-10 pb-10 pt-6",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const ControlsSection = styled.section.attrs({
  className: `flex w-full justify-between items-center px-10 py-6`,
})`
  transform: rotate(180deg);
`

ProviderOnboarding.getInitialProps = async ctx => {
  const { req } = ctx
  try {
    const id = getLastPath(req.originalUrl)

    const {
      data: { paymentRequest, childcareProvider, user },
    } = await axios.get(
      `${process.env.HOST}/api/get-payment-request-from-id?id=${id}`
    )

    const {
      data: { company },
    } = await axios.get(
      `${process.env.HOST}/api/get-company-public?company_number=${childcareProvider.companyNumber}`
    )

    return { paymentRequest, childcareProvider, user, company }
  } catch (error) {
    console.error("Error in [id] getInitProps: ", error) //eslint-disable-line
    return {
      error:
        "Sorry, there seems to have been a problem retrieving that payment. Please check that the link is correct and try again!",
    }
  }
}

export default ProviderOnboarding
