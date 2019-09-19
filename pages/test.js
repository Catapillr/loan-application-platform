import Head from "next/head"
import Link from "next/link"
import styled from "styled-components"
import axios from "axios"
import nextCookies from "next-cookies"
import * as R from "ramda"

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

    <Link href="/">
      <a>home</a>
    </Link>
  </Container>
)

Home.getInitialProps = async ctx => {
  // we need this when the axios request gets sent from the server rather than the browser
  // as the session cookies are not passed along to axios from the req obect. This is not
  // a problem on the browser as cookies are added to every request automatically
  const cookies = nextCookies(ctx)
  const serializedCookies = R.pipe(
    R.mapObjIndexed((val, key) => `${key}=${val};`),
    R.values,
    R.join(" ")
  )(cookies)

  try {
    const res = await axios.get(`${process.env.HOST}/api/test`, {
      headers: { Cookie: serializedCookies },
    })

    const {
      data: { allUsers },
    } = res

    return { allUsers }
  } catch (err) {
    console.error("Error in test getInitProps: ", err) //eslint-disable-line
    return {}
  }
}

export default Home
