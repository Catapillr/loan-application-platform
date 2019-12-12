import styled from 'styled-components'
import { Input } from '../Input'
import { Heading, Copy } from './styles'

const Container = styled.main.attrs(({ className }) => ({
  className: `flex flex-wrap m-auto justify-between ${className}`,
}))`
  width: ${({ width }) => (width ? `${width}%` : '50%')};
`

const Questions = ({ title, subheader, questions, formWidth, className }) => (
  <Container width={formWidth} className={className}>
    <Heading className={`${subheader ? `mb-2` : `mb-10`} w-full`}>
      {title}
    </Heading>
    {subheader && <Copy className="mb-10">{subheader}</Copy>}
    {questions.map((attrs, index) =>
      attrs.custom ? (
        <attrs.component key={`input-${index}`} {...attrs} />
      ) : (
        <Input key={`input-${index}`} {...attrs} />
      ),
    )}
  </Container>
)

export default Questions
