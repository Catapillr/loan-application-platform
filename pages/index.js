import Head from "next/head"
import styled from "styled-components"
import axios from "axios"
import Link from "next/link"

import { useAuth } from "../context/auth-context"

const Container = styled.div``

const Home = ({ allUsers }) => {
  const { login, logout } = useAuth()

  return (
    <Container>
      <Head>
        <title>Catapillr</title>

        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/static/fonts/ubuntu/ubuntu-v14-latin-regular.woff2"
          crossOrigin="true"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/static/fonts/ubuntu/ubuntu-v14-latin-italic.woff2"
          crossOrigin="true"
        />
      </Head>

      <a className="mr-3" onClick={login}>
        Login
      </a>
      <a className="mr-3" onClick={logout}>
        Logout
      </a>
      <a className="mr-3" href="/test">
        Go to test
      </a>
      <Link href="/test">
        <a className="mr-3">Broken go to test</a>
      </Link>

      <pre>{JSON.stringify(allUsers, undefined, 2)}</pre>
    </Container>
  )
}

Home.getInitialProps = async () => {
  // TODO: maybe add axios default baseURL
  const res = await axios.get(`${process.env.HOST}/api/get-users`)
  const {
    data: { allUsers },
  } = res
  return { allUsers }
}

export default Home
