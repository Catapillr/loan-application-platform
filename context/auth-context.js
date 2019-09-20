import React from "react"
import Router from "next/router"

const AuthContext = React.createContext()

const AuthProvider = props => {
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
