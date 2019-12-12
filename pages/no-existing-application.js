import styled from 'styled-components'

const ErrorDiv = styled.div.attrs({
  className: 'w-auto block bg-white px-10 pb-10 pt-6',
})`
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 6px 1px rgba(0, 0, 0, 0.06);
`

const Home = () => {
  return (
    <ErrorDiv>
      Sorry we haven't received a loan application from that email address. If
      you have applied for a loan and are still seeing this page when trying to
      log in please get in touch with{' '}
      <span className="text-teal">phil@catapillr.com</span>.
    </ErrorDiv>
  )
}

export default Home
