import Head from "next/head"
import styled from "styled-components"
import axios from "axios"

import Nav from "../components/nav"

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

    <Nav />

    <div className="hero">
      <h1 className="title">Welcome to Next.js!</h1>
      <p className="description">
        To get started, edit <code>pages/index.js</code> and save to reload.
      </p>

      <div className="row">
        <a href="https://github.com/zeit/next.js#setup" className="card">
          <h3>Getting Started &rarr;</h3>
          <p>Learn more about Next.js on GitHub and in their examples.</p>
        </a>
        <a
          href="https://github.com/zeit/next.js/tree/master/examples"
          className="card"
        >
          <h3>Examples &rarr;</h3>
          <p>Find other example boilerplates on the Next.js GitHub.</p>
        </a>
        <a href="https://github.com/zeit/next.js" className="card">
          <h3>Create Next App!</h3>
          <p>Was this tool helpful? Let us know how we can improve it!</p>
          <p>It's working!</p>
        </a>
      </div>
      <pre>{JSON.stringify(allUsers, undefined, 2)}</pre>
    </div>
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
