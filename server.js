const express = require("express")
const next = require("next")
const session = require("express-session")
const passport = require("passport")
const Auth0Strategy = require("passport-auth0")

const { prisma } = require("./prisma/generated/js")

const authRoutes = require("./server/auth-routes")

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

// // const restrictAccessPage = (req, res, next) => {
// //   if (req.isAuthenticated()) return next()
// //   req.session.returnTo = req.originalUrl
// //   res.redirect("/login")
// }

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
  passport.serializeUser((user, done) => done(null, user._json.email))
  // this add the user to `req.user` on authenticated requests
  passport.deserializeUser(async (email, done) => {
    const user = await prisma.user({ email })
    done(null, user)
  })

  server.use(passport.initialize())
  server.use(passport.session())

  server.use(authRoutes)

  // server.get("/test", restrictAccessPage)
  server.get("/api/test", restrictAccessAPI)

  server.get("*", (req, res) => {
    return handle(req, res)
  })

  server.post("*", (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`) //eslint-disable-line
  })
})
