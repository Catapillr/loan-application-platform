import { ErrorMessage, Field } from "formik"
import styled from "styled-components"

const TextInput = styled.input.attrs(() => ({
  className:
    "py-3 border-solid border-2 border-midgray rounded-full text-center",
}))``

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

const Input = ({ text, component, name, fieldType, width }) => (
  <Container>
    {text && <Label>{text}</Label>}
    <Field component={component} name={name} type={fieldType} />
    <ErrorMessage name={name} render={msg => <Error>{msg}</Error>} />
  </Container>
)

const DateInput = ({ text, component, dateInputNames, name }) => (
  <Container>
    {text && <Label>{text}</Label>}

    <div className="flex justify-between">
      {dateInputNames.map((name, index) => (
        <Field
          key={`date-${index}`}
          component={component}
          name={name}
          type="number"
        />
      ))}
    </div>

    {dateInputNames.map((name, index) => (
      <ErrorMessage
        key={`error-${index}`}
        name={name}
        render={msg => <Error>Hello??{msg}</Error>}
      />
    ))}
  </Container>
)

export { Input, DateInput, TextInput }
