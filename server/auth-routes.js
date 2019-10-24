const express = require("express")
const passport = require("passport")
const util = require("util")
const url = require("url")
const querystring = require("querystring")

const router = express.Router()

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID } = process.env

// Perform the login, after login Auth0 will redirect to callback
router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  }),
  (req, res) => {
    res.redirect("/")
  }
)

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get("/callback", (req, res, next) => {
  passport.authenticate("auth0", (err, user) => {
    if (err) return next(err)
    if (!user) return res.redirect("/login")
    req.logIn(user, err => {
      if (err) return next(err)

      const returnTo = req.session.returnTo
      delete req.session.returnTo
      res.redirect(returnTo || "/")
    })
  })(req, res, next)
})

// Perform session logout and redirect to homepage
router.get("/logout", (req, res) => {
  req.logout()

  let returnTo = req.protocol + "://" + req.hostname
  const port = req.connection.localPort
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ":" + port
  }

  const logoutURL = new url.URL(
    util.format("https://%s/v2/logout", AUTH0_DOMAIN)
  )

  const searchString = querystring.stringify({
    client_id: AUTH0_CLIENT_ID,
    returnTo,
  })

  logoutURL.search = searchString
  res.redirect(logoutURL)
})

module.exports = router
