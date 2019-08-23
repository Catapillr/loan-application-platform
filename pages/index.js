import Head from "next/head"
import styled from "styled-components"
import axios from "axios"

import Nav from "../components/nav"

const Container = styled.div`
  .hero {
    background-color: ${cssTheme("colors.indigo.100")};
  }
  .title {
    margin: 0;
    width: 100%;
    padding-top: 80px;
    line-height: 1.15;
    font-size: 48px;
  }
  .title,
  .description {
    text-align: center;
  }
  .row {
    max-width: 880px;
    margin: 80px auto 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .card {
    padding: 18px 18px 24px;
    width: 220px;
    text-align: left;
    text-decoration: none;
    color: #434343;
    border: 1px solid #9b9b9b;
    font-family: Alegreya;
  }
  .card:hover {
    border-color: #067df7;
  }
  .card h3 {
    margin: 0;
    color: #067df7;
    font-size: 18px;
  }
  .card p {
    margin: 0;
    padding: 12px 0 0;
    font-size: 13px;
    color: #333;
  }
`

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
  const res = await axios.get("http://localhost:3000/api/get-users")
  const {
    data: { allUsers },
  } = res
  return { allUsers }
}

export default Home
