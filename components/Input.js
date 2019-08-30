import { ErrorMessage, Field } from "formik"
import styled, { css } from "styled-components"

import slider from "../static/icons/slider.svg"
import dropdown from "../static/icons/dropdown.svg"

const TextInput = styled.input.attrs(({ field }) => {
  return {
    className:
      "mr-10 border-solid border-2 border-midgray rounded-full py-2d5 px-9",
    ...field,
  }
})``

const RangeInput = styled.input.attrs(({ field }) => {
  return {
    className: "",
    ...field,
  }
})`
  ${css`
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
  `}
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
  max,
  values,
  options,
}) => {
  console.log("opt", options)
  return (
    <Container>
      {text && <Label>{text}</Label>}
      {fieldType === "select" ? (
        <StyledDropdown component="select" name={name}>
          {options.map((option, index) => (
            <option
              key={`dropdown-${name}-${index}`}
              value={option}
              label={`${option} months`}
            />
          ))}
        </StyledDropdown>
      ) : (
        <Field
          type={fieldType}
          component={component}
          name={name}
          max={max}
          min="0"
          value={values[name]}
        />
      )}
      {fieldType === "range" && (
        <div className="border-2 border-midgray rounded-full py-2 px-4 mt-6 w-40 ">
          {values[name] ? `£${values[name]}` : "£"}
        </div>
      )}

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

export { Input, DateInput, TextInput, RangeInput }
