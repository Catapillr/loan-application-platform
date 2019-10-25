const express = require("express")
const next = require("next")
const session = require("express-session")
const passport = require("passport")
const Auth0Strategy = require("passport-auth0")
const redis = require("redis")
const connectRedis = require("connect-redis")
const enforce = require("express-sslify")
const cron = require("node-cron")
const util = require("util")
const url = require("url")
const querystring = require("querystring")

const NO_EXISTING_USER = "no-existing-user"

// both these will be removed after tested cron
const mailgun = require("mailgun.js")
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: "https://api.eu.mailgun.net",
})

const { prisma } = require("./prisma/generated/js")

const authRoutes = require("./server/auth-routes")
const {
  cleanUpChildcareProviders,
  cleanUpVerificationTokens,
  cleanUpPaymentRequests,
} = require("./server/clean-up-db")

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

// const restrictAccessPage = (req, res, next) => {
//   if (req.isAuthenticated()) return next()
//   req.session.returnTo = req.originalUrl
//   res.redirect("/login")
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
    const client = redis.createClient(process.env.REDIS_URL)
    const RedisStore = connectRedis(session)

    // TODO: see whether this can be added back in
    // sess.cookie.secure = true // serve secure cookies, requires https
    sess.store = new RedisStore({ client })
  }

  server
    .use(session(sess))
    .use(
      dev
        ? (req, res, next) => next()
        : enforce.HTTPS({ trustProtoHeader: true })
    )

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

  passport.use(strategy)
  passport.serializeUser((user, done) => done(null, user._json.email))
  // this add the user to `req.user` on authenticated requests
  passport.deserializeUser(async (email, done) => {
    const user = await prisma.user({ email })
    if (user) {
      return done(null, user)
    }
    return done({ error: NO_EXISTING_USER }, null)
  })

  server.use(passport.initialize())
  server.use(passport.session())

  server.use(authRoutes)

  server.use(({ error }, req, res, next) => {
    if (error === NO_EXISTING_USER) {
      req.logout()

      let returnTo = `${req.protocol}://${req.hostname}`
      const port = req.connection.localPort
      if (port !== undefined && port !== 80 && port !== 443) {
        returnTo += ":" + port
      }

      returnTo += "/no-existing-application"

      const logoutURL = new url.URL(
        util.format("https://%s/v2/logout", AUTH0_DOMAIN)
      )

      const searchString = querystring.stringify({
        client_id: AUTH0_CLIENT_ID,
        returnTo,
      })

      logoutURL.search = searchString
      res.redirect(logoutURL)
    }
    next()
  })

  // server.get("/test", restrictAccessPage)
  // server.get("/api/test", restrictAccessAPI)

  if (!dev) {
    cron.schedule("0 0 */1 * *", () => {
      cleanUpChildcareProviders()
      cleanUpPaymentRequests()
      cleanUpVerificationTokens()

      mg.messages
        .create(process.env.MAILGUN_DOMAIN, {
          from: "Catapillr <catapillr@mg.catapillr.com>",
          to: ["lucy@infactcoop.com"],
          subject: "Hello",
          text: "Testing some Mailgun awesomness!",
          html: "<h1>Testing some Mailgun awesomness!</h1>",
        })
        .then(msg => console.log(msg)) //eslint-disable-line
        .catch(err => console.log(err)) //eslint-disable-line
    })
  }

  server.get("/", (_req, res) => {
    res.redirect("https://www.catapillr.com/")
  })

  server.get("/api/private/*", restrictAccessAPI)

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
