import styled from "styled-components"

const Container = styled.div`
  background-color: white;
  right: 300px;
  .pre-block {
    background: #dedede;
    font-size: 14px;
    border-radius: 4px;
    color: #666;
  }

  .pre-block pre {
    font-size: 14px;
    padding: 20px;
  }

  .pre-block__title {
    padding: 20px 20px 0;
    text-transform: uppercase;
    font-weight: 700;
  }
`

const PreBlock = props => (
  <Container className="pre-block absolute">
    {props.title && <div className="pre-block__title">{props.title}</div>}
    <pre>{props.children}</pre>
  </Container>
)

export default PreBlock
