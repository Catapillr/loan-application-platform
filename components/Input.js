import { ErrorMessage, Field } from "formik"

const Input = ({ text, component, name, fieldType, width }) => (
  <div className={`${text && "flex flex-col"} w-${width}`}>
    {text && <label htmlFor={name}>{text}</label>}
    <Field component={component} name={name} type={fieldType} />
    <ErrorMessage className="red" name={name} />
  </div>
)

const DateInput = ({ text, component, dateInputNames, name }) => (
  <div className={`${text && "flex flex-col"} w-full}`}>
    {text && <label htmlFor={name}>{text}</label>}
    <div className="flex">
      {dateInputNames.map((name, index) => (
        <Field key={index} component={component} name={name} />
      ))}
    </div>
    {dateInputNames.map((name, index) => (
      <ErrorMessage key={index} className="red" name={name} />
    ))}
  </div>
)

export { Input, DateInput }
