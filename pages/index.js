import Head from "next/head"
import styled from "styled-components"
import axios from "axios"

const Container = styled.div``

const Home = ({ allUsers }) => (
  <Container>
    <Head>
      <title>Catapillr</title>

      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href="/static/fonts/ubuntu-v14-latin-regular.woff2"
        crossOrigin="true"
      />
      <link
        rel="preload"
        as="font"
        type="font/woff2"
        href="/static/fonts/ubuntu-v14-latin-italic.woff2"
        crossOrigin="true"
      />
    </Head>
    <pre>{JSON.stringify(allUsers, undefined, 2)}</pre>
  </Container>
)

Home.getInitialProps = async () => {
  const res = await axios.get(`${process.env.HOST}/api/get-users`)
  const {
    data: { allUsers },
  } = res
  return { allUsers }
}

export default Home
