import React from "react"
// import cookie from "js-cookie"
import Router from "next/router"
// import { FullPageSpinner } from "../components/lib"

const AuthContext = React.createContext()

const AuthProvider = props => {
  // code for pre-loading the user's information if we have their token in
  // localStorage goes here
  // 🚨 this is the important bit.
  // Normally your provider components render the context provider with a value.
  // But we post-pone rendering any of the children until after we've determined
  // whether or not we have a user token and if we do, then we render a spinner
  // while we go retrieve that user's information.
  // if (weAreStillWaitingToGetTheUserData) {
  //   return <FullPageSpinner />
  // }

  const login = () => {
    // cookie.set("sessionToken", "logged-in", { expires: 1 })
    Router.push("/login")
  }

  // const register = () => {} // register the user
  const logout = () => {
    // cookie.remove("sessionToken")
    Router.push("/logout")
  }

  return <AuthContext.Provider value={{ login, logout }} {...props} />
}

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export { AuthProvider, useAuth }
