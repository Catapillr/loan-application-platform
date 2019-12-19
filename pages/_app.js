import React from 'react'
import App from 'next/app'
import styled, { ThemeProvider } from 'styled-components'

import ErrorBoundary from '../components/ErrorBoundary'

import { AuthProvider } from '../context/auth-context'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../tailwind.config.js'
import catapillr_background from '../static/catapillr_background.svg'

import '../styles/index.css'

const Container = styled.div.attrs(() => ({
  className: 'flex justify-center items-center',
}))`
  background: url(${catapillr_background}) no-repeat,
    linear-gradient(to left top, rgba(20, 190, 203, 0.24), white);
  background-size: cover;
  min-height: 100vh;
  height: fit-content;
`

const { theme } = resolveConfig(tailwindConfig)

toast.configure()

class MyApp extends App {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps(appContext) {
  //   // calls page's `getInitialProps` and fills `appProps.pageProps`
  //   const appProps = await App.getInitialProps(appContext);
  //
  //   return { ...appProps }
  // }

  render() {
    const { Component, pageProps } = this.props
    return (
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Container>
            <ErrorBoundary shadowed>
              <Component {...pageProps} />
            </ErrorBoundary>
          </Container>
        </ThemeProvider>
      </AuthProvider>
    )
  }
}

export default MyApp
