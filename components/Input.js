import { ErrorMessage, Field } from "formik"
import styled from "styled-components"

const TextInput = styled.input.attrs(({ field }) => {
  return {
    className:
      "mr-10 border-solid border-2 border-midgray rounded-full py-2d5 px-9",
    ...field,
  }
})``

const NumberInput = styled.input.attrs(({ field }) => {
  return {
    className:
      "border-solid border-2 border-midgray rounded-full py-2d5 text-center",
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

const Input = ({ text, component, fieldType = "text", width, name }) => {
  return (
    <Container>
      {text && <Label>{text}</Label>}
      <Field type={fieldType} component={component} name={name} />
      <ErrorMessage name={name} render={msg => <Error>{msg}</Error>} />
    </Container>
  )
}

const DateInput = ({ text, dateInputNames }) => (
  <Container>
    {text && <Label>{text}</Label>}

    <div className="flex justify-between pr-10">
      {dateInputNames.map((name, index) => (
        <Field
          key={`date-${index}`}
          name={name}
          component={NumberInput}
          placeholder={index === 0 ? "Day" : index === 1 ? "Month" : "Year"}
          type="number"
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
