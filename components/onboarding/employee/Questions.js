import styled from "styled-components"
import { Input, DateInput } from "../../Input"
import { Heading } from "../styles"

const Container = styled.main.attrs(() => ({
  className: "flex flex-wrap m-auto justify-between",
}))`
  width: ${({ width }) => (width ? `${width}%` : "50%")};
`

const Questions = ({ title, questions, formWidth }) => (
  <Container width={formWidth}>
    <Heading className="mb-10 w-full">{title}</Heading>
    {questions.map((attrs, index) =>
      attrs.date ? (
        <DateInput key={`input-${index}`} {...attrs} />
      ) : (
        <Input key={`input-${index}`} {...attrs} />
      )
    )}
  </Container>
)

export default Questions
