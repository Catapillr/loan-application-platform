import React, { useState, useEffect } from "react"
import nextCookies from "next-cookies"

import { Formik, Form } from "formik"

import axios from "axios"
import * as R from "ramda"
import styled from "styled-components"

import restrictAccess from "../../utils/restrictAccess"

import * as Steps from "../../components/onboarding/make-a-payment/stepNames"
import Email from "../../components/onboarding/make-a-payment/Email"
import Pay from "../../components/onboarding/make-a-payment/Pay"
import Summary from "../../components/onboarding/make-a-payment/Summary"

import Header from "../../components/Header"
import Footer from "../../components/Footer"

const initialValues = {
  providerEmail: "",
  amountToPay: "",
  reference: "",
  consentToPay: false,
}

const onSubmit = ({ incrementPage, company, user }) => async values => {
  const requestBody = {
    childcareProvider: {
      providerEmail: values.providerEmail,
      companyNumber: company.company_number,
    },
    paymentRequest: {
      amountToPay: values.amountToPay,
      consentToPay: values.consentToPay,
      reference: values.reference,
    },
    user,
  }

  try {
    await axios.post(
      `${process.env.HOST}/api/send-payment-request`,
      requestBody
    )
    incrementPage()
  } catch (e) {
    //eslint-disable-next-line no-console
    console.error("Loan agreement sending error", e)
  }
}

const Wizard = ({ children, company, user }) => {
  const [page, setPage] = useState(Steps.Email)
  // const [formCompleted, setFormCompleted] = useState(false)
  const steps = React.Children.toArray(children)

  const pages = steps.map(step => step.type.componentName)
  const pageIndex = R.findIndex(R.equals(page))(pages)
  const activePage = R.find(R.pathEq(["type", "componentName"], page))(steps)

  const { validationSchema } = activePage && activePage.type

  const incrementPage = () => {
    setPage(pages[pageIndex + 1])
  }

  const decrementPage = () => {
    setPage(pages[pageIndex - 1])
  }

  const Controls = () => (
    <_Controls>
      <Back
        onClick={pageIndex !== 0 ? decrementPage : undefined}
        href={pageIndex === 0 ? "/make-a-payment" : undefined}
      >
        Back
      </Back>
      <PageCounter>
        {pageIndex + 1} / {pages.length}
      </PageCounter>
    </_Controls>
  )

  return (
    <Container>
      <Header activeHref="/make-a-payment" />
      <Formik
        {...{
          initialValues,
          validationSchema,
          onSubmit: onSubmit({ incrementPage, company, user }),
          enableReinitialize: false,
        }}
      >
        {({
          isValid,
          submitForm,
          isSubmitting,
          validateForm,
          values,
          setTouched,
          setFieldValue,
        }) => {
          return (
            <Contents>
              <Main>
                <Title className="mb-12">Make a payment</Title>

                <Form>
                  <RenderStep
                    {...{
                      validateForm,
                      page,
                      setTouched,
                      component: React.cloneElement(activePage, {
                        setPage,
                        values,
                        incrementPage,
                        submitForm,
                        isValid,
                        isSubmitting,
                        setFieldValue,
                        company,
                        Controls,
                      }),
                    }}
                  ></RenderStep>
                </Form>
              </Main>
              <Aside>
                <Tip>
                  <h2 className="font-bold mb-6">How does this work?</h2>
                  <p className="mb-6">
                    Unfortunately, the childcare provider you selected is not
                    yet on our database.
                  </p>
                  <p className="mb-6">
                    The good news is that we can send them an email invite with
                    a magic link containing the amount you would like to pay.
                  </p>

                  <p className="mb-6">
                    As soon as they sign up, they will be able to easily claim
                    the amount, and you will be notified!
                  </p>
                </Tip>
              </Aside>
            </Contents>
          )
        }}
      </Formik>
      <Footer />
    </Container>
  )
}

const RenderStep = ({ component, validateForm, page, setTouched }) => {
  useEffect(() => {
    setTouched({})
    validateForm()
  }, [page])

  return <>{component}</>
}

const Onboarding = ({ company, user }) => {
  if (company.catapillrID) {
    return (
      <Wizard {...{ company, user }}>
        <Pay />
        <Summary />
      </Wizard>
    )
  }

  return (
    <Wizard {...{ company, user }}>
      <Email />
      <Pay />
      <Summary />
    </Wizard>
  )
}

const Contents = styled.section.attrs({
  className: "flex flex-grow justify-between pl-43 pr-12 py-18 h-full",
})``

const Main = styled.main.attrs({
  className: "w-6/12",
})``

const Aside = styled.aside.attrs({
  className: "w-5/12 flex justify-center",
})``

const Tip = styled.aside.attrs({
  className: "mt-27 bg-white py-10 px-9 w-8/12",
})`
  height: fit-content;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const Title = styled.h1.attrs({
  className: "font-bold font-3xl",
})``

const Container = styled.div.attrs({
  className: "w-full bg-lightgray min-h-screen flex flex-col justify-between",
})``

const _Controls = styled.nav.attrs({
  className: "flex justify-between items-center",
})``

const Back = styled.a.attrs({
  className: "cursor-pointer",
})``

const PageCounter = styled.div.attrs({
  className: "",
})``

Onboarding.getInitialProps = async ctx => {
  const { req } = ctx
  // makes sure session is authenticated and that page is server side rendered
  // (auth does not work at the moment without SSR)
  restrictAccess(ctx)

  // we need this when the axios request gets sent from the server rather than the browser
  // as the session cookies are not passed along to axios from the req object. This is not
  // a problem on the browser as cookies are added to every request automatically
  const cookies = nextCookies(ctx)
  const serializedCookies = R.pipe(
    R.mapObjIndexed((val, key) => `${key}=${val};`),
    R.values,
    R.join(" ")
  )(cookies)

  try {
    const company_number = R.last(req.originalUrl.split("/"))

    const res = await axios.get(
      `${process.env.HOST}/api/get-company?company_number=${company_number}`,
      {
        headers: { Cookie: serializedCookies },
      }
    )

    const {
      data: { company },
    } = res

    const user = req.user

    return { company, user }
  } catch (err) {
    console.error("Error in [company_number] getInitProps: ", err) //eslint-disable-line
    return {}
  }
}

export default Onboarding
