import React, { useState, useEffect } from "react"

import { Formik, Form } from "formik"

import axios from "axios"
import * as R from "ramda"

import styled from "styled-components"

import * as Steps from "../../components/onboarding/make-a-payment/stepNames"
import Email from "../../components/onboarding/make-a-payment/Email"
import Pay from "../../components/onboarding/make-a-payment/Pay"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

const initialValues = {
  company: {
    company_number: undefined,
    title: "",
  },
  providerID: undefined,
  amountToPay: 0,
  reference: "",
  providerEmail: "",
  consentToPay: false,
}

const onSubmit = ({ incrementPage }) => async values => {
  //eslint-disable-next-line no-console
  console.log("onboarding employee/form submitted", values)
  try {
    incrementPage()
  } catch (e) {
    //eslint-disable-next-line no-console
    console.error("Loan agreement sending error", e)
  }
}

const Wizard = ({ children, company }) => {
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
        onClick={pageIndex !== 0 && decrementPage}
        href={pageIndex === 0 && "/make-a-payment"}
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
      <Header />
      <Formik
        {...{
          initialValues,
          validationSchema,
          onSubmit: onSubmit({ incrementPage }),
          enableReinitialize: false,
        }}
      >
        {({
          // isValid,
          // isSubmitting,
          validateForm,
          values,
          // submitForm,
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
                    Search for your childcare provider by entering their name or
                    company number into the search bar (left).
                  </p>
                  <p>
                    Select the provider from the list. In case your provider
                    doesnt show up, add them by sending them an email letting
                    know that you would like to use their services through the
                    catapillr scheme.
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

const Onboarding = ({ company }) => {
  return (
    <Wizard company={company}>
      {company.catapillrID ? <Pay /> : <Email />}
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
  className: "bg-white py-10 px-9 w-8/12",
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
  className: "",
})``

const PageCounter = styled.div.attrs({
  className: "",
})``

Onboarding.getInitialProps = async ({ req }) => {
  const company_number = R.last(req.originalUrl.split("/"))

  const res = await axios(
    `${process.env.HOST}/api/get-company?company_number=${company_number}`
  )
  const {
    data: { company },
  } = res

  return { company }
}

export default Onboarding
