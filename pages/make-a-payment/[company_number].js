import React, { useState, useEffect } from 'react'
import nextCookies from 'next-cookies'
import Link from 'next/link'

import { Formik, Form } from 'formik'

import axios from 'axios'
import * as R from 'ramda'
import styled from 'styled-components'

import restrictAccess from '../../utils/restrictAccess'
import getLastPath from '../../utils/getLastPath'

import * as Steps from '../../components/multistep-forms/make-a-payment/stepNames'
import Email from '../../components/multistep-forms/make-a-payment/Email'
import Pay from '../../components/multistep-forms/make-a-payment/Pay'
import Summary from '../../components/multistep-forms/make-a-payment/Summary'
import Confirmation from '../../components/multistep-forms/make-a-payment/Confirmation'
import ErrorBoundary from '../../components/ErrorBoundary'

import Header from '../../components/Header'
import Footer from '../../components/Footer'

const initialValues = {
  providerEmail: '',
  amountToPay: '',
  reference: '',
  consentToPay: false,
}

const MakeAPayment = ({
  company,
  user,
  catapillrChildcareProvider,
  userWalletBalance,
}) => {
  if (catapillrChildcareProvider) {
    return (
      <Wizard
        {...{ company, user, catapillrChildcareProvider, userWalletBalance }}
      >
        <Pay />
        <Summary />
        <Confirmation />
      </Wizard>
    )
  }

  return (
    <Wizard
      {...{ company, user, catapillrChildcareProvider, userWalletBalance }}
    >
      <Email />
      <Pay />
      <Summary />
      <Confirmation />
    </Wizard>
  )
}

MakeAPayment.getInitialProps = async ctx => {
  const { req } = ctx
  // makes sure session is authenticated and that page is server side rendered
  // (auth does not work at the moment without SSR)

  if (restrictAccess(ctx)) {
    return
  }

  // we need this when the axios request gets sent from the server rather than the browser
  // as the session cookies are not passed along to axios from the req object. This is not
  // a problem on the browser as cookies are added to every request automatically
  const cookies = nextCookies(ctx)
  const serializedCookies = R.pipe(
    R.mapObjIndexed((val, key) => `${key}=${val};`),
    R.values,
    R.join(' '),
  )(cookies)

  try {
    const company_number = getLastPath(req.originalUrl)

    const [
      {
        data: { company, catapillrChildcareProvider },
      },
      {
        data: { userWalletBalance },
      },
    ] = await Promise.all([
      axios.get(
        `${process.env.HOST}/api/private/get-company?company_number=${company_number}`,
        {
          headers: { Cookie: serializedCookies },
        },
      ),
      axios.get(`${process.env.HOST}/api/private/get-user-wallet-balance`, {
        headers: { Cookie: serializedCookies },
      }),
    ])

    const user = req.user

    return { company, user, catapillrChildcareProvider, userWalletBalance }
  } catch (err) {
    console.error('Error in [company_number] getInitProps: ', err) //eslint-disable-line
    return { error: "Sorry, that company doesn't seem to exist!" }
  }
}

const Wizard = ({
  children,
  company,
  user,
  catapillrChildcareProvider,
  userWalletBalance,
}) => {
  const [isProviderRegistered] = useState(!!catapillrChildcareProvider)

  const initialPage = isProviderRegistered ? Steps.Pay : Steps.Email
  const [page, setPage] = useState(initialPage)

  const [formCompleted, setFormCompleted] = useState(false)
  const steps = React.Children.toArray(children)

  const pages = steps.map(step => step.type.componentName)
  const pageIndex = R.findIndex(R.equals(page))(pages)
  const activePage = R.find(R.pathEq(['type', 'componentName'], page))(steps)

  const { validationSchema, AsideContents } = activePage && activePage.type

  const incrementPage = () => {
    setPage(pages[pageIndex + 1])
  }

  const decrementPage = () => {
    setPage(pages[pageIndex - 1])
  }

  return (
    <Container>
      <Header />
      <Formik
        {...{
          initialValues,
          validationSchema,
          onSubmit: onSubmit({
            incrementPage,
            company,
            user,
            setFormCompleted,
            isProviderRegistered,
            catapillrChildcareProvider,
          }),
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
            <ErrorBoundary shadowed>
              <Contents formCompleted={formCompleted}>
                <Main>
                  <Title
                    className={`mb-12 ${
                      formCompleted ? 'text-center' : 'text-left'
                    }`}
                  >
                    {formCompleted ? 'Thank you!' : 'Make a payment'}
                  </Title>

                  {!company ? (
                    <ErrorBox>
                      That's not a valid company number, sorry! Try{' '}
                      <Link href="/make-a-payment">
                        <span className="underline text-teal cursor-pointer">
                          searching again
                        </span>
                      </Link>
                      .
                    </ErrorBox>
                  ) : (
                    <Form>
                      <ErrorBoundary shadowed>
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
                              // eslint-disable-next-line react/display-name
                              Controls: () => (
                                <Controls
                                  {...{ pageIndex, decrementPage, pages }}
                                />
                              ),
                              isProviderRegistered,
                              userWalletBalance,
                            }),
                          }}
                        ></RenderStep>
                      </ErrorBoundary>
                    </Form>
                  )}
                </Main>
                {!formCompleted && company && AsideContents && (
                  <Aside>
                    <Tip>
                      <h2 className="font-bold mb-6">How does this work?</h2>
                      <AsideContents />
                    </Tip>
                  </Aside>
                )}
              </Contents>
            </ErrorBoundary>
          )
        }}
      </Formik>
      <Footer />
    </Container>
  )
}

const Controls = ({ pageIndex, decrementPage, pages }) => (
  <_Controls>
    <Back
      onClick={pageIndex !== 0 ? decrementPage : undefined}
      href={pageIndex === 0 ? '/make-a-payment' : undefined}
    >
      Back
    </Back>
    <PageCounter>
      {pageIndex + 1} / {pages.length}
    </PageCounter>
  </_Controls>
)

const onSubmit = ({
  incrementPage,
  company,
  setFormCompleted,
  isProviderRegistered,
  catapillrChildcareProvider,
}) => async values => {
  const childcareProvider = {
    providerEmail: values.providerEmail,
    companyNumber: company.company_number,
  }
  const paymentRequest = {
    amountToPay: values.amountToPay,
    consentToPay: isProviderRegistered ? true : values.consentToPay,
    reference: values.reference,
  }

  const setupProviderAndSendPayment = () => {
    return axios.post(
      `${process.env.HOST}/api/private/add-childcare-provider`,
      {
        ...childcareProvider,
        ...paymentRequest,
      },
    )
  }

  const sendPayment = () => {
    return axios.post(`${process.env.HOST}/api/private/send-payment-request`, {
      ...paymentRequest,
      childcareProviderId: catapillrChildcareProvider.id,
    })
  }

  try {
    isProviderRegistered
      ? await sendPayment()
      : await setupProviderAndSendPayment()

    incrementPage()
    setFormCompleted(true)
  } catch (e) {
    //eslint-disable-next-line no-console
    console.error('Loan agreement sending error', e)
  }
}

const RenderStep = ({ component, validateForm, page, setTouched }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
    setTouched({})
    validateForm()
  }, [page])

  return <>{component}</>
}

const Contents = styled.section.attrs(({ formCompleted }) => ({
  className: `flex ${
    formCompleted
      ? 'justify-center items-center px-43'
      : 'flex-grow justify-between pl-43 pr-12'
  } py-18 h-full`,
}))``

const Main = styled.main.attrs({
  className: 'w-6/12',
})``

const Aside = styled.aside.attrs({
  className: 'w-5/12 flex justify-center',
})``

const Tip = styled.aside.attrs({
  className: 'mt-27 bg-white py-10 px-9 w-8/12',
})`
  height: fit-content;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`
const ErrorBox = styled.div.attrs({
  className: 'w-full block bg-white px-10 pb-10 pt-6',
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Title = styled.h1.attrs({
  className: 'font-bold font-3xl',
})``

const Container = styled.div.attrs({
  className: 'w-full bg-lightgray min-h-screen flex flex-col justify-between',
})``

const _Controls = styled.nav.attrs({
  className: 'flex justify-between items-center',
})``

const Back = styled.a.attrs({
  className: 'cursor-pointer',
})``

const PageCounter = styled.div.attrs({
  className: '',
})``

export default MakeAPayment
