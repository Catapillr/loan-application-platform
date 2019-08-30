import { ErrorMessage, Field } from "formik"
import styled from "styled-components"

import slider from "../static/icons/slider.svg"
import tick from "../static/icons/tick.svg"

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

const Input = ({ text, component, type = "text", name, validate, max }) => {
  return (
    <Container text={text}>
      {text && <Label>{text}</Label>}
      <Field
        type={type}
        component={component}
        name={name}
        validate={validate}
        max={max}
      />
      <ErrorMessage name={name} render={msg => <Error>{msg}</Error>} />
    </Container>
  )
}

const TextInput = styled.input.attrs(({ field }) => {
  return {
    className:
      "mr-10 border-solid border-2 border-midgray rounded-full py-2d5 px-9",
    ...field,
  }
})``

const Checkbox = styled.input.attrs()``

const CheckboxContainer = styled.label`
  /* Customize the label (the container) */
  display: block;
  position: relative;
  cursor: pointer;
  user-select: none;

  /* Hide the browser's default checkbox */
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 2px solid ${cssTheme("colors.midgray")};
  }

  /* When the checkbox is checked, add a blue background */
  input:checked ~ .checkmark {
    background-color: ${cssTheme("colors.teal")};
    border: none;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkmark:after {
    width: 30px;
    height: 30px;
    background-image: url(${tick});
    background-repeat: no-repeat;
    background-position: center;
  }
`

const AddHeight = styled.div`
  height: 30px;
`

const CheckboxInput = ({ type, field }) => {
  return (
    <CheckboxContainer>
      <AddHeight></AddHeight>
      <Checkbox type={type} {...field}></Checkbox>
      <span className="checkmark"></span>
    </CheckboxContainer>
  )
}

const RangeInput = styled.input.attrs(({ field }) => {
  return {
    className: "",
    ...field,
  }
})`
  -webkit-appearance: none; /* Override default CSS styles */
  appearance: none;
  width: 100%; /* Full-width */
  height: 5px; /* Specified height */
  background-color: #d3d3d3; /* Grey background */
  outline: none; /* Remove outline */
  opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
  -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
  transition: opacity 0.2s;
  ${"" /* overflow: hidden; */}

  ::-webkit-slider-runnable-track {
    height: 20px;
    -webkit-appearance: none;
    color: #fc8f14;
  }

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: url(${slider});
    cursor: pointer;
  }

  ::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: url(${slider});
    cursor: pointer;
  }

  ::-moz-range-progress {
    background-color: #fc8f14;
  }

  ::-moz-range-track {
    background-color: #d3d3d3;
  }

  ::-ms-fill-lower {
    background-color: #fc8f14;
  }

  ::-ms-fill-upper {
    background-color: #d3d3d3;
  }
`

const NumberInput = styled.input.attrs(({ field }) => {
  return {
    className:
      "border-solid border-2 border-midgray rounded-full py-2d5 text-center",
    ...field,
  }
})``

const DateInput = ({ text, dateInputNames, validate }) => (
  <Container>
    {text && <Label>{text}</Label>}

    <div className="flex justify-between pr-10">
      {dateInputNames.map((name, index) => (
        <Field
          key={`date-${index}`}
          name={name}
          component={NumberInput}
          placeholder={index === 0 ? "Day" : index === 1 ? "Month" : "Year"}
          validate={validate}
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

export { Input, DateInput, TextInput, RangeInput, CheckboxInput }
