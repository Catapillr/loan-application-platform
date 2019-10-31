export default ({ req, res }) => {
  /*
   * If `ctx.req` is available it means we are on the server.
   */
  if (!req) {
    throw new Error(`
    This page must be server side rendered for auth to work.
    If you used Link from next/link to get here please change it to normal a tag.
  `)
  }

  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    res.writeHead(302, { Location: "/login" })
    res.end()
    return true
  }

  return false
}
