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

const Input = ({
  text,
  component,
  fieldType = "text",
  width,
  name,
  validate,
}) => {
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

const DateInput = ({ text, component, dateInputNames, validate }) => (
  <Container>
    {text && <Label>{text}</Label>}

    <div className="flex justify-between">
      {dateInputNames.map((name, index) => (
        <Field
          key={`date-${index}`}
          name={name}
          component={component}
          placeholder={index === 0 ? "Day" : index === 1 ? "Month" : "Year"}
          validate={validate}
          type="number"
          validate={validate}
        />
      ))}
    </div>

    {dateInputNames.map((name, index) => (
      <ErrorMessage
        key={`error-${index}`}
        name={name}
        render={msg => <Error>{msg}</Error>}
      />
    ))}
  </Container>
)

export { Input, DateInput, TextInput }
