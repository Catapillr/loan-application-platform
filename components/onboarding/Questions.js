import styled from "styled-components"
import { Input } from "../Input"
import { Heading } from "./styles"

const Container = styled.main.attrs(({ className }) => ({
  className: `flex flex-wrap m-auto justify-between ${className}`,
}))`
  width: ${({ width }) => (width ? `${width}%` : "50%")};
`

const Questions = ({ title, questions, formWidth, className }) => (
  <Container width={formWidth} className={className}>
    <Heading className="mb-10 w-full">{title}</Heading>
    {questions.map((attrs, index) =>
      attrs.custom ? (
        <attrs.component key={`input-${index}`} {...attrs} />
      ) : (
        <Input key={`input-${index}`} {...attrs} />
      )
    )}
  </Container>
)

export default Questions
