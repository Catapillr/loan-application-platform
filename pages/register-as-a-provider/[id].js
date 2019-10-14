import React, { useState, useEffect } from "react"
import { Formik, Form, Field } from "formik"
import styled from "styled-components"
import axios from "axios"
import * as R from "ramda"

import * as Steps from "../../components/onboarding/register-as-a-provider/stepNames"
import getLastPath from "../../utils/getLastPath"

import Welcome from "../../components/onboarding/register-as-a-provider/Welcome"
import BusinessDetails from "../../components/onboarding/register-as-a-provider/BusinessDetails"
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
//   ownerFirstName: "",
//   ownerLastName: "",
//   ownerKeyContact: "",
//   ownerDob: { day: "", month: "", year: "" },
//   ownerCountryOfResidence: "",
//   ownerNationality: "",
//   proofOfId: {
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
  ownerFirstName: "Maximus",
  ownerLastName: "Gerber",
  // TODO: do we need this field?
  ownerKeyContact: "Lucy",
  ownerDob: { day: "17", month: "03", year: "1992" },
  ownerCountryOfResidence: "GB",
  ownerNationality: "GB",
  proofOfId: {
    // lastModified: 1570704053202,
    // lastModifiedDate: "Thu Oct 10 2019 11:40:53 GMT+0100 (British Summer Time)",
    // name: "Screenshot 2019-10-10 at 11.40.47.png",
    // size: 948892,
    // type: "image/png",
    // webkitRelativePath: "",
  },
  articlesOfAssociation: {
    // lastModified: 1570704053202,
    // lastModifiedDate: "Thu Oct 10 2019 11:40:53 GMT+0100 (British Summer Time)",
    // name: "Screenshot 2019-10-10 at 11.40.47.png",
    // size: 948892,
    // type: "image/png",
    // webkitRelativePath: "",
  },
  proofOfRegistration: {
    // lastModified: 1570704053202,
    // lastModifiedDate: "Thu Oct 10 2019 11:40:53 GMT+0100 (British Summer Time)",
    // name: "Screenshot 2019-10-10 at 11.40.47.png",
    // size: 948892,
    // type: "image/png",
    // webkitRelativePath: "",
  },
  bankName: "Monzo",
  accountNumber: "17918586",
  sortCode: {
    firstSection: "23",
    secondSection: "69",
    thirdSection: "72",
  },
  AddressLine1: "Space 4",
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

// const createNewToken = async ({ email }) => {
//   const res = await axios.post(`${process.env.HOST}/api/create-new-token`, {
//     email,
//   })

//   const {
//     data: { token },
//   } = res

//   return { token }
// }

// const isTokenValid = async ({ email, token }) => {
//   const res = await axios(
//     `${process.env.HOST}/api/is-token-valid?email=${email}&token=${token}`
//   )

//   const {
//     data: { isTokenValid },
//   } = res

//   return { isTokenValid }
// }

const Controls = ({
  page,
  isValid,
  isSubmitting,
  // values,
  formCompleted,
  // setFormCompleted,
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
}) => async values => {
  //eslint-disable-next-line no-console
  console.log("employeeOnboarding form submitted")

  // TODO: Make form object -> formdata function into util
  try {
    const form = new FormData()

    const normalFields = R.pipe(
      R.map(val => (val instanceof File ? null : val)),
      R.filter(el => !!el)
    )(values)

    const fileFields = R.pipe(
      R.map(val => (val instanceof File ? val : null)),
      R.filter(el => !!el)
    )(values)

    R.mapObjIndexed((val, key) => form.append(key, val))(values)

    console.log("woooooooooooooooooooooo", normalFields)
    console.log("woooooooooooooooooooooo file", fileFields)

    const promise = (file, key) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve({ [key]: reader.result })
        }
        return reader.readAsDataURL(file)
      })
    }

    const files = await Promise.all(
      R.pipe(R.mapObjIndexed((file, key) => promise(file, key)))(fileFields)
    )

    console.log("files: ", files)

    // const promise = () =>
    //   new Promise((resolve, reject) => {
    //     R.mapObjIndexed((val, key) => {
    //       if (val instanceof File) {
    //         const reader = new FileReader()
    //         reader.onloadend = () => {
    //           form.append(key, reader.result)
    //           resolve()
    //         }
    //         return reader.readAsDataURL(val)
    //       }
    //       return form.append(key, val)
    //     })(values)
    //   })
    //
    // axios.post("/api/register-provider", form)
    incrementPage()
  } catch (e) {
    // TODO: trigger submit error (maybe with toast error)

    //eslint-disable-next-line no-console
    console.error("Loan agreement sending error", e)
  }
}

const Wizard = ({ children, paymentRequest, childcareProvider, user }) => {
  const [page, setPage] = useState(Steps.Documents)
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
        initialValues,
        validationSchema,
        onSubmit: onSubmit({
          incrementPage,
          paymentRequest,
          childcareProviderEmail: childcareProvider.email,
        }),
        enableReinitialize: false,
        isInitialValid: true,
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
        console.log(values)
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
  error,
}) => {
  if (error) {
    return <div>{error}</div>
  }

  return (
    <Wizard {...{ paymentRequest, childcareProvider, user }}>
      <Welcome />
      <BusinessDetails />
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

const ControlsSection = styled.section.attrs({
  className: `flex w-full justify-between items-center px-10 py-6`,
})`
  transform: rotate(180deg);
`

ProviderOnboarding.getInitialProps = async ctx => {
  const { req } = ctx
  try {
    const id = getLastPath(req.originalUrl)

    const res = await axios.get(
      `${process.env.HOST}/api/get-payment-request-from-id?id=${id}`
    )

    const {
      data: { paymentRequest, childcareProvider, user },
    } = res

    // const company =
    await axios.get(
      `${process.env.HOST}/api/get-company-public?company_number=${childcareProvider.companyNumber}`
    )

    return { paymentRequest, childcareProvider, user }
  } catch (error) {
    console.error("Error in [id] getInitProps: ", error) //eslint-disable-line
    return {
      error:
        "Sorry, there seems to have been a problem retrieving that payment. Please check that the link is correct and try again!",
    }
  }
}

export default ProviderOnboarding