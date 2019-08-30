const webpack = require("webpack") //eslint-disable-line
const path = require("path") //eslint-disable-line
const withPlugins = require("next-compose-plugins")
const withImages = require("next-images")
const withCSS = require("@zeit/next-css")
const withFonts = require("next-fonts")

const FRONTEND_ENV_KEYS = ["NODE_ENV", "HOST"]

const envPlugin = FRONTEND_ENV_KEYS.reduce(
  (result, key) =>
    Object.assign({}, result, {
      [`process.env.${key}`]: JSON.stringify(process.env[key]),
    }),
  {}
)

module.exports = withPlugins([withImages, withCSS, withFonts], {
  webpack: (config, { isServer }) => {
    // adds access to specific env variables on front end
    config.plugins.push(new webpack.DefinePlugin(envPlugin))

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      }
    }
    config.plugins.push(
      new webpack.ProvidePlugin({
        cssTheme: path.resolve(path.join(__dirname, "utils/cssTheme")),
      })
    )

    return config
  },
})
