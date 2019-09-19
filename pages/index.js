import Head from "next/head"
import Link from "next/link"
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

    <a className="mr-3" href="/login">
      Login
    </a>
    <a className="mr-3" href="/logout">
      logout
    </a>
    <Link href="/test">
      <a className="mr-3">test</a>
    </Link>

    <pre>{JSON.stringify(allUsers, undefined, 2)}</pre>
  </Container>
)

Home.getInitialProps = async () => {
  // TODO: maybe add axios default baseURL
  const res = await axios.get(`${process.env.HOST}/api/get-users`)
  const {
    data: { allUsers },
  } = res
  return { allUsers }
}

export default Home
