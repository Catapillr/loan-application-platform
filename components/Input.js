import { ErrorMessage, Field } from "formik"
import styled from "styled-components"

import slider from "../static/icons/slider.svg"
import tick from "../static/icons/tick.svg"
import dropdown from "../static/icons/dropdown.svg"

const Container = styled.div.attrs(({ text, width }) => ({
  className: `${text && "flex flex-col"} w-${width || "full"} mb-10`,
}))``

const Error = styled.span.attrs({
  className: "text-red absolute mt-1",
})``

const Label = styled.label.attrs(({ name }) => ({
  className: "block mb-5",
  htmlFor: name,
}))``

const ChooseInput = props => {
  const {
    type,
    options,
    component,
    max,
    placeholder,
    validate,
    errors,
    touched,
    name,
  } = props
  switch (type) {
    case "select":
      return (
        <StyledDropdown component="select" name={name}>
          {options.map((option, index) => (
            <option
              key={`dropdown-${name}-${index}`}
              value={option}
              label={`${option} months`}
            />
          ))}
        </StyledDropdown>
      )
    case "checkbox":
      return (
        <CheckboxInput {...{ errors, touched, name, type }}></CheckboxInput>
      )

    default:
      return (
        <Field
          type={type}
          component={component}
          name={name}
          max={max}
          min="0"
          placeholder={placeholder}
          validate={validate}
        />
      )
  }
}

const Input = ({
  text,
  component,
  type = "text",
  name,
  validate,
  placeholder,
  max,
  values,
  options,
  errors,
  touched,
}) => {
  return (
    <Container text={text}>
      {text && <Label>{text}</Label>}
      {
        <ChooseInput
          {...{
            text,
            component,
            type,
            name,
            validate,
            placeholder,
            max,
            values,
            options,
            errors,
            touched,
          }}
        />
      }
      {type === "range" && (
        <div className="border-2 border-midgray rounded-full py-2 px-4 mt-6 w-40 ">
          {values[name] ? `£${values[name]}` : "£"}
        </div>
      )}
      <div className="relative">
        <ErrorMessage name={name} render={msg => <Error>{msg}</Error>} />
      </div>
    </Container>
  )
}

const TextInput = styled.input.attrs(({ field, form: { errors, touched } }) => {
  const { name } = field
  return {
    className: `mr-10 border-solid border-2 rounded-full py-2d5 px-9 ${
      errors[name] && touched[name] ? "border-red" : "border-midgray"
    }`,
    ...field,
  }
})``

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
    border: 2px solid
      ${({ errors, touched, name }) =>
        errors[name] && touched[name]
          ? cssTheme("colors.red")
          : cssTheme("colors.midgray")};
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

const CheckboxInput = ({ errors, touched, name, type }) => (
  <CheckboxContainer {...{ errors, touched, name }}>
    <AddHeight></AddHeight>
    <Field name={name}>
      {({ field }) => <input type={type} {...field} checked={field.value} />}
    </Field>
    <span className="checkmark"></span>
  </CheckboxContainer>
)

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
`

const NumberInput = styled.input.attrs(({ field }) => {
  return {
    className:
      "border-solid border-2 border-midgray rounded-full py-2d5 text-center",
    ...field,
  }
})``

const StyledDropdown = styled(Field).attrs({
  className:
    "border-2 border-midgray rounded-full py-3 px-4 mt-6 w-40 text-center",
})`
  display: block;
  line-height: 1.3;
  margin: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url(${dropdown});
  background-repeat: no-repeat, repeat;
  background-position: right 0.8em top 50%, 0 0;
`

const DateInput = ({ text, validate, name }) => (
  <Container>
    {text && <Label>{text}</Label>}

    <div className="flex justify-between pr-10">
      <Field
        name={`${name}.day`}
        component={NumberInput}
        placeholder={"Day"}
        validate={validate}
        type="number"
      />
      <Field
        name={`${name}.month`}
        component={NumberInput}
        placeholder={"Month"}
        type="number"
      />
      <Field
        name={`${name}.year`}
        component={NumberInput}
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

export { Input, DateInput, TextInput, RangeInput, CheckboxInput }
