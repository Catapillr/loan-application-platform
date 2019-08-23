const webpack = require("webpack") //eslint-disable-line
const path = require("path") //eslint-disable-line
const withPlugins = require("next-compose-plugins")
const withCSS = require("@zeit/next-css")
const withFonts = require("next-fonts")

module.exports = withPlugins([withCSS, withFonts], {
  webpack: (config, { isServer }) => {
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
