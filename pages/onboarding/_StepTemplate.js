import { Input, DateInput } from "../../components/Input"

const StepTemplate = ({ title, questions }) => (
  <main className="flex flex-wrap" style={{ width: 50 + "%" }}>
    <h1>{title}</h1>
    {questions.map(
      ({ text, dateInputNames, component, fieldType, name, width }, index) =>
        dateInputNames ? (
          <DateInput
            key={index}
            text={text}
            dateInputNames={dateInputNames}
            //   component={component}
            name={name}
          />
        ) : (
          <Input
            key={index}
            text={text}
            // component={component}
            fieldType={fieldType}
            name={name}
            width={width}
          />
        )
    )}
  </main>
)

export default StepTemplate
