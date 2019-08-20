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

    return config
  },
})
