import Head from "next/head"
import styled from "styled-components"
import axios from "axios"

const Container = styled.div``

const Home = () => (
  <Container>
    <Head>
      <title>Catapillr</title>

      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href="/static/fonts/ubuntu-v14-latin-regular.woff2"
        crossOrigin={true}
      />
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href="/static/fonts/ubuntu-v14-latin-italic.woff2"
        crossOrigin={true}
      />
    </Head>
  </Container>
)

Home.getInitialProps = async () => {
  // TODO: add variable for host in here
  const res = await axios.get(
    "https://catapillr-staging.herokuapp.com/api/get-users"
  )
  const {
    data: { allUsers },
  } = res
  return { allUsers }
}

export default Home
