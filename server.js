const express = require("express")
const next = require("next")
const session = require("express-session")
const passport = require("passport")
const Auth0Strategy = require("passport-auth0")
const util = require("util")
const url = require("url")
const querystring = require("querystring")

const {
  NODE_ENV,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_CALLBACK_URL,
  SESSION_SECRET,
  PORT,
} = process.env

const port = parseInt(PORT, 10) || 3000
const dev = NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

const restrictAccessPage = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.session.returnTo = req.originalUrl
  res.redirect("/login")
}

const restrictAccessAPI = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.sendStatus(401)
}

app.prepare().then(() => {
  const server = express()

  const sess = {
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: true,
  }

  if (dev) {
    server.use(require("cors")())
  } else {
    sess.cookie.secure = true // serve secure cookies, requires https
  }

  const strategy = new Auth0Strategy(
    {
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      callbackURL: AUTH0_CALLBACK_URL || "http://localhost:3000/callback",
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile)
    }
  )

  server.use(session(sess))

  passport.use(strategy)
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))

  server.use(passport.initialize())
  server.use(passport.session())

  // Perform the login, after login Auth0 will redirect to callback
  server.get(
    "/login",
    passport.authenticate("auth0", {
      scope: "openid email profile",
    }),
    (req, res) => {
      res.redirect("/")
    }
  )

  // Perform the final stage of authentication and redirect to previously requested URL or '/user'
  server.get("/callback", (req, res, next) => {
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
  server.get("/logout", (req, res) => {
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

  server.get("/test", restrictAccessPage)
  server.get("/api/test", restrictAccessAPI)

  server.get("*", (req, res) => {
    if (!req.isAuthenticated()) {
      res.clearCookie("connect.sid")
    }
    return handle(req, res)
  })

  server.post("*", (req, res) => {
    if (!req.isAuthenticated()) {
      res.clearCookie("connect.sid")
    }
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`) //eslint-disable-line
  })
})
