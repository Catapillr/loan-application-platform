import { ErrorMessage, Field } from "formik"
import styled, { css } from "styled-components"
import TextArea from "react-autosize-textarea"
import * as R from "ramda"

import slider from "../static/icons/slider.svg"
import tick from "../static/icons/tick.svg"
import dropdown from "../static/icons/dropdown.svg"
import document from "../static/icons/document.svg"
import upload from "../static/icons/upload.svg"

const Input = ({ text, width, name, margin, direction, link, ...attrs }) => {
  return (
    <Container {...{ text, width, margin, direction }}>
      {text && <LabelAndLink name={name} link={link} text={text} />}
      {attrs.component === NumberInput ? (
        <InputWrap name={name}>
          <Field {...{ name, direction, id: name, ...attrs }} />
        </InputWrap>
      ) : (
        <Field {...{ name, direction, id: name, ...attrs }} />
      )}
      <div className="relative">
        <ErrorMessage
          name={name}
          render={msg => (
            <Error
              direction={direction}
              className={
                (name === "confirmation" || name === "gdprConsent") && "pl-11d5"
              }
            >
              {msg}
            </Error>
          )}
        />
      </div>
    </Container>
  )
}

const TextInput = styled.input.attrs(
  ({ field, width, form: { errors, touched } }) => {
    const { name } = field
    return {
      className: `${(!width || width === "full") &&
        "mr-10"} border-solid border-2 rounded-full py-2d5 px-9 ${
        errors[name] && touched[name] ? "border-red" : "border-midgray"
      }`,
      ...field,
    }
  }
)``

const _FileInput = styled.input.attrs({
  type: "file",
  className: "hidden",
})``

const _FileLabel = styled.label.attrs(
  ({ field: { name }, width, form: { errors, touched } }) => ({
    className: `w-${width ||
      "full"} border-2 border-dashed rounded-11 flex flex-col justify-center py-11 ${
      errors[name] && touched[name] ? "border-red" : "border-midgray"
    }`,
    htmlFor: name,
    type: "file",
  })
)``

const FileInput = attrs => {
  const { file } = attrs

  return (
    <>
      <_FileInput id={attrs.field.name} {...attrs} />
      <_FileLabel {...attrs}>
        <img src={file && file.name ? document : upload} className="mb-2"></img>
        <div className="text-center">
          {(file && file.name) || "Browse files"}
        </div>
      </_FileLabel>
    </>
  )
}

const TextAreaInput = styled(TextArea).attrs(({ field, disabled }) => {
  return {
    className: "border-0 w-full",
    disabled,
    ...field,
  }
})``

const PriceInput = styled.input.attrs(
  ({ field, form: { errors, touched }, disabled }) => {
    const { name } = field
    return {
      className: `font-subheader ${errors[name] &&
        touched[name] &&
        "border-red"}`,
      disabled,
      ...field,
    }
  }
)``

const CheckboxInput = ({
  form: { errors, touched, values },
  field,
  type,
  direction,
  id,
}) => {
  const { name } = field
  const horizontal = direction === "flex-row-reverse"

  return (
    <CheckboxContainer {...{ errors, touched, name }}>
      {horizontal ? <AddWidth /> : <AddHeight />}
      <input type={type} checked={values[name]} {...field} id={id} />
      <span className="checkmark"></span>
    </CheckboxContainer>
  )
}

const SortCodeInput = ({
  text,
  name,
  validate,
  className,
  keepFieldCleanOnChange,
}) => (
  <Container>
    {text && <Label htmlFor={name}>{text}</Label>}

    <div className="flex justify-between pr-10">
      <Field
        id={name}
        name={`${name}.firstSection`}
        component={NumberInput}
        maxLength={2}
        placeholder={"00"}
        onChange={keepFieldCleanOnChange(`${name}.firstSection`)}
        {...{ className }}
      />
      <Field
        name={`${name}.secondSection`}
        component={NumberInput}
        maxLength={2}
        placeholder={"00"}
        onChange={keepFieldCleanOnChange(`${name}.secondSection`)}
        {...{ className }}
      />
      <Field
        name={`${name}.thirdSection`}
        component={NumberInput}
        maxLength={2}
        placeholder={"00"}
        onChange={keepFieldCleanOnChange(`${name}.thirdSection`)}
        {...{ className, validate }}
      />
    </div>

    <div className="relative">
      <ErrorMessage
        name={`${name}.thirdSection`}
        render={msg => <Error>{msg}</Error>}
      ></ErrorMessage>
    </div>
  </Container>
)

const DateInput = ({
  text,
  validate,
  name,
  disabled = { day: false, month: false, year: false },
}) => (
  <Container>
    {text && <Label htmlFor={name}>{text}</Label>}

    <div className="flex justify-between pr-10">
      <Field
        id={name}
        name={`${name}.day`}
        component={NumberInput}
        placeholder={"DD"}
        type="number"
        disabled={disabled.day}
        className={disabled.day && "bg-lightgray"}
      />
      <Field
        name={`${name}.month`}
        component={NumberInput}
        placeholder={"MM"}
        type="number"
        disabled={disabled.month}
        className={disabled.month && "bg-lightgray"}
      />
      <Field
        name={`${name}.year`}
        component={NumberInput}
        placeholder={"YYYY"}
        validate={validate}
        type="number"
        disabled={disabled.year}
        className={disabled.year && "bg-lightgray"}
      />
    </div>

    <div className="relative">
      <ErrorMessage
        name={`${name}.year`}
        render={msg => <Error>{msg}</Error>}
      ></ErrorMessage>
    </div>
  </Container>
)

const InputWrap = styled.span.attrs({
  className: "w-full",
})`
  margin-top: -20px;

  ::before {
      position: relative;
      content: "£";
      left: 36px;
      ${({ name }) => name === "annualSalary" && "top: 32px"};
    }
  }

`

const NumberInput = styled.input.attrs(
  ({ field, form: { errors, touched } }) => {
    const { name } = field

    const pathToField = R.split(".", name)
    const rootField = pathToField[0]

    const showErrors =
      R.path(pathToField, errors) && R.path(pathToField, touched)

    const showDateErrors = (() => {
      if ([".day", ".month"].some(suffix => name.includes(suffix))) {
        const pathToYearSubField = [rootField, "year"]
        return (
          R.path(pathToYearSubField, errors) &&
          R.path(pathToYearSubField, touched)
        )
      }
    })()

    const showSortCodeErrors = (() => {
      if (
        [".firstSection", ".secondSection"].some(suffix =>
          name.includes(suffix)
        )
      ) {
        const pathToThirdSectionSubField = [rootField, "thirdSection"]
        return (
          R.path(pathToThirdSectionSubField, errors) &&
          R.path(pathToThirdSectionSubField, touched)
        )
      }
    })()

    return {
      className: `${name === "annualSalary" &&
        "w-full"} border-solid border-2 border-${
        showErrors || showDateErrors || showSortCodeErrors ? "red" : "midgray"
      } rounded-full py-2d5 text-center mr-2`,
      type: "text",

      pattern: "\\d*",
      ...field,
    }
  }
)``

const RangeInput = ({ field, ...attrs }) => {
  return (
    <>
      <Range {...field} {...attrs} />
    </>
  )
}

const Range = styled.input.attrs(({ field }) => ({ ...field }))`
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

const SelectInput = ({ width, field, options, form, placeholder, ...rest }) => {
  return (
    <Select {...{ width, field, form, ...rest }}>
      <option value="">{placeholder}</option>
      {options.map(({ label, value }) => (
        <option
          key={`dropdown-${label}-${value}`}
          value={value}
          label={`${label}`}
        />
      ))}
    </Select>
  )
}

const Select = styled.select.attrs(
  ({ width, field, form: { errors, touched }, className, disabled }) => {
    const { name } = field
    return {
      className: `border-2 border-${
        errors[name] && touched[name] ? "red" : "midgray"
      } bg-white rounded-full py-3 px-9 mt-6 w-${width} text-center ${className}`,
      disabled,
      ...field,
    }
  }
)`
  display: block;
  line-height: 1.3;
  margin: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  // background-color: #fff;
  background-image: url(${dropdown});
  background-repeat: no-repeat, repeat;
  background-position: right 0.8em top 50%, 0 0;
`

const Container = styled.div.attrs(
  ({ text, width, margin = "mb-10", direction = "flex-col" }) => ({
    className: `${text && `flex ${direction}`} w-${width || "full"} ${margin}`,
  })
)``

const Error = styled.span.attrs({
  className: `text-red absolute mt-1`,
})`
 ${({ direction }) =>
   direction === "flex-row-reverse" &&
   css`
     margin-top: 72px;
     width: 100vw;
   `}
  }
`

const Label = styled.label.attrs(({ name, link }) => ({
  className: `block ${link ? "mb-2" : "mb-5"}`,
  htmlFor: name,
}))``

const LabelAndLink = ({ name, link, text }) => (
  <div className="flex flex-col w-full">
    <Label name={name} link={link}>
      {text}
    </Label>
    {link && (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        <span className="text-teal underline mb-3"> {link.text}</span>
      </a>
    )}
  </div>
)

const AddHeight = styled.div`
  height: 30px;
`
const AddWidth = styled.div.attrs({
  className: "mr-4",
})`
  width: 30px;
`

const CheckboxContainer = styled.label.attrs({
  className: "block relative cursor-pointer select-none",
})`
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

export {
  Input,
  DateInput,
  SortCodeInput,
  TextInput,
  PriceInput,
  FileInput,
  TextAreaInput,
  RangeInput,
  CheckboxInput,
  SelectInput,
  NumberInput,
}
