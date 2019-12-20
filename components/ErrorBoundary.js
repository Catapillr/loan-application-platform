import ErrorBoundary from 'react-error-boundary'
import styled from 'styled-components'

const Container = styled.div.attrs({
  className: 'flex items-center justify-center w-full bg-white py-12 px-4',
})`
  box-shadow: ${({ shadowed }) =>
    shadowed
      ? '0 0 8px 2px rgba(0, 0, 0, 0.03), 0 16px 24px 0 rgba(0, 0, 0, 0.1)'
      : 'none'};
`

const InnerContainer = styled.main.attrs({
  className: 'flex flex-col justify-around',
})``

const SomethingWentWrong = ({ shadowed }) => (
  <Container shadowed={shadowed}>
    <InnerContainer>
      <div className="font-3xl text-center">Oh no! :(</div>
      <div className="font-xl mb-5 text-center">
        Looks like something went wrong.
      </div>
      <div className="font-base mb-5 text-center">
        We've already logged this error for you so we can take a look at it.
      </div>
      <div className="text-center">
        Please do{' '}
        <a href="." className="text-teal">
          refresh your page
        </a>{' '}
        and try again.
      </div>
    </InnerContainer>
  </Container>
)

const StyledErrorBoundary = ({ children, shadowed, id }) => (
  <ErrorBoundary
    FallbackComponent={() => <SomethingWentWrong shadowed={shadowed} id={id} />}
  >
    {children}
  </ErrorBoundary>
)

export default StyledErrorBoundary
