import styled from "styled-components"
import { Input, DateInput } from "../../components/Input"
import { Heading, Copy } from "./styles"

const Container = styled.main.attrs(() => ({
  className: "w-2/4 flex flex-wrap m-auto",
}))`
  width: ${({ width }) => (width ? `${width}%` : "")};
`

const Questions = ({ title, questions }) => (
  <Container>
    <Heading className="mb-10">{title}</Heading>
    {questions.map(
      ({ text, dateInputNames, component, fieldType, name, width }, index) =>
        dateInputNames ? (
          <DateInput
            key={`date-input-${index}`}
            text={text}
            dateInputNames={dateInputNames}
            component={component}
          />
        ) : (
          <Input
            key={`input-${index}`}
            text={text}
            component={component}
            fieldType={fieldType}
            name={name}
            width={width}
          />
        )
    )}
  </Container>
)

export default Questions
