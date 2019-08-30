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
    {questions.map((attrs, index) =>
      attrs.dateInputNames ? (
        <DateInput key={`date-input-${index}`} {...attrs} />
      ) : (
        <Input key={`input-${index}`} {...attrs} />
      )
    )}
  </Container>
)

export default Questions
