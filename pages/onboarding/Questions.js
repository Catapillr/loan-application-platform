import styled from "styled-components"
import { Input, DateInput } from "../../components/Input"
import { Heading } from "./styles"

const Container = styled.main.attrs(() => ({
  className: "flex flex-wrap m-auto",
}))`
  width: ${({ width }) => (width ? `${width}%` : "50%")};
`

const Questions = ({ title, questions, formWidth }) => (
  <Container width={formWidth}>
    <Heading className="mb-10">{title}</Heading>
    {questions.map(
      (
        {
          text,
          dateInputNames,
          component,
          type,
          name,
          width,
          placeholder,
          max,
        },
        index
      ) =>
        dateInputNames ? (
          <DateInput
            key={`date-input-${index}`}
            text={text}
            dateInputNames={dateInputNames}
          />
        ) : (
          <Input
            key={`input-${index}`}
            text={text}
            component={component}
            type={type}
            name={name}
            width={width}
            placeholder={placeholder}
            max={max}
          />
        )
    )}
  </Container>
)

export default Questions
