import { ErrorMessage, Field } from "formik"
import styled from "styled-components"

const TextInput = styled.input.attrs(({ field }) => {
  return {
    className:
      "py-3 border-solid border-2 border-midgray rounded-full text-center",
    ...field,
  }
})``

const Container = styled.div.attrs(({ text, width }) => ({
  className: `${text && "flex flex-col"} w-${width || "full"} mb-10`,
}))``

const Error = styled.div.attrs(() => ({
  className: "text-red",
}))``

const Label = styled.label.attrs(({ name }) => ({
  className: "block mb-5",
  htmlFor: name,
}))``

const Input = ({ text, component, fieldType = "text", name, validate }) => {
  return (
    <Container>
      {text && <Label>{text}</Label>}
      <Field
        type={fieldType}
        component={component}
        name={name}
        validate={validate}
      />
      <ErrorMessage name={name} render={msg => <Error>{msg}</Error>} />
    </Container>
  )
}

const DateInput = ({ text, component, validate, name }) => (
  <Container>
    {text && <Label>{text}</Label>}

    <div className="flex justify-between">
      <Field
        name={`${name}.day`}
        component={component}
        placeholder={"Day"}
        validate={validate}
        type="number"
      />
      <Field
        name={`${name}.month`}
        component={component}
        placeholder={"Month"}
        type="number"
      />
      <Field
        name={`${name}.year`}
        component={component}
        placeholder={"Year"}
        type="number"
      />
    </div>

    <ErrorMessage
      name={`${name}.day`}
      render={msg => <Error>{msg}</Error>}
    ></ErrorMessage>
  </Container>
)

export { Input, DateInput, TextInput }
