import { useState } from "react"
import styled from "styled-components"
import axios from "axios"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/router"
import currencyFormatter from "currency-formatter"

import { Input, PriceInput, TextAreaInput } from "../../../components/Input"

import restrictAccess from "../../../utils/restrictAccess"

import Header from "../../../components/Header"
import Footer from "../../../components/Footer"

import Tick from "../../../static/icons/tick-in-circle.svg"

import Pen from "../../../static/icons/pen.svg"
import Nursery from "../../../static/icons/nursery.svg"

const initialValues = {
  amountToPay: "",
  taxFreeChildReference: "",
}

const validationSchema = Yup.object().shape({
  amountToPay: Yup.string().required("Required!"),
  taxFreeChildReference: Yup.string().required("Required!"),
})

const PayIntoChildAccount = () => {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const router = useRouter()
  const { taxFreeChildReference, name } = router.query
  return (
    <Container>
      <Header />
      {!formSubmitted ? (
        <Contents>
          <Main>
            <Title className="mb-12">Make a payment</Title>
            <FormContainer>
              <PaymentForm
                setFormSubmitted={setFormSubmitted}
                name={name}
                taxFreeChildReference={taxFreeChildReference}
              ></PaymentForm>
            </FormContainer>
          </Main>
          <Aside>
            <Tip>
              <h2 className="font-bold mb-6">How does this work?</h2>
              <p className="mb-6">We need something here.</p>
              <p className="mb-6">To explain what it does.</p>
              <p>
                Can't find who you want to pay?{" "}
                <a
                  className="text-teal underline"
                  href="https://catapillr.com/contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Send us an email now.
                </a>
              </p>
            </Tip>
          </Aside>
        </Contents>
      ) : (
        <Confirmation name={name}></Confirmation>
      )}
      <Footer />
    </Container>
  )
}

PayIntoChildAccount.getInitialProps = async ctx => {
  if (restrictAccess(ctx)) {
    return
  }
  return {}
}

const PaymentForm = ({ setFormSubmitted, name, taxFreeChildReference }) => {
  return (
    <>
      <_Controls>
        <Back href="/tax-free-childcare/pay">Back</Back>
      </_Controls>
      <Icon src={Nursery} />
      <p className="text-center">
        You are making a payment to <span className="font-bold">{name}'s</span>{" "}
        tax-free account
      </p>

      <Formik
        {...{
          initialValues: { ...initialValues, taxFreeChildReference },
          validationSchema,
          enableReinitialize: false,
          onSubmit: async (values, actions) => {
            try {
              await axios.post(
                "/api/private/pay-out-to-tax-free-account",
                values
              )
              setFormSubmitted(true)
              actions.setSubmitting(false)
            } catch (err) {
              //eslint-disable-next-line no-console
              console.error("Error sending tax free payment to server", err)
              if (err.response) {
                const { status, reason } = err.response.data
                if (
                  status === "FAILED" &&
                  reason === "Unsufficient wallet balance"
                ) {
                  actions.setFieldError(
                    "amountToPay",
                    "You don't have sufficient funds in your account"
                  )
                }
              }
              actions.setSubmitting(false)
            }
          },
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => {
          const { amountToPay } = values
          return (
            <Form className="mt-6">
              <Copy>How much would you like to pay?</Copy>
              <Input
                name="amountToPay"
                onBlur={e => {
                  setFieldValue(
                    "amountToPay",
                    currencyFormatter.format(e.target.value, { code: "GBP" })
                  )
                }}
                validate={value => {
                  const amount =
                    currencyFormatter.unformat(value, { code: "GBP" }) * 100

                  if (amount <= 0) {
                    return "Amount must be more than 0"
                  }
                }}
                component={PriceInput}
                size={amountToPay.length > 7 ? amountToPay.length : 7}
                className="text-center block m-auto"
                placeholder="£0.00"
              />
              <Reference>
                <Edit />
                <Input
                  name="taxFreeChildReference"
                  disabled={true}
                  margin=""
                  component={TextAreaInput}
                />
              </Reference>

              <Submit
                className={`mt-10 ${isSubmitting && "opacity-50"}`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Send money now"}
              </Submit>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

const Confirmation = ({ name }) => (
  <ConfirmationContainer>
    <Icon src={Tick} />
    <p className="text-center uppercase">Great news!</p>
    <p className="text-center mb-4">
      You added <span className="font-bold">{name}'s</span> tax free account
    </p>
    <Submit as="a" href="/tax-free-childcare/pay">
      Go back
    </Submit>
  </ConfirmationContainer>
)

const Container = styled.div.attrs({
  className: "w-full bg-lightgray min-h-screen flex flex-col justify-between",
})``

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
  className: "bg-white py-10 px-9 w-8/12 mt-27",
})`
  height: fit-content;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1);
`

const Title = styled.h1.attrs({
  className: "font-bold font-3xl",
})``

const Icon = styled.img.attrs(({ src }) => ({
  className: "w-12 h-12 mb-3 m-auto",
  src,
}))``

const FormContainer = styled.section.attrs({
  className: "w-full block bg-white px-10 pb-10 pt-6",
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const ConfirmationContainer = styled.div.attrs({
  className: "bg-white p-10 flex flex-col items-center",
})`
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
  min-height: 400px;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const _Controls = styled.nav.attrs({
  className: "flex justify-between items-center",
})``

const Back = styled.a.attrs({
  className: "cursor-pointer",
})``

const Submit = styled.button.attrs({
  className:
    "text-teal border border-teal rounded-full py-2 px-6 text-center block m-auto",
})``

const Reference = styled.div.attrs({
  className:
    "border-t border-b border-midgray py-10 flex items-center justify-center mb-10",
})``

const Copy = styled.p.attrs({
  className: "text-center",
})``

const Edit = styled.img.attrs({
  src: Pen,
  className: "mr-8",
})``

export default PayIntoChildAccount
