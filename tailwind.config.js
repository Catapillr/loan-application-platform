const screens = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
}

module.exports = {
  theme: {
    screens,
    media: {
      sm: `(min-width: ${screens.sm})`,
      md: `(min-width: ${screens.md})`,
      lg: `(min-width: ${screens.lg})`,
      xl: `(min-width: ${screens.xl})`,
    },
    extend: {
      spacing: {
        "2d5": "0.625rem", // 10px
        "3d5": "0.875rem", // 14px
        "4": "1rem", // 16px
        "5": "1.25rem", // 20px
        "5d5": "1.375rem", // 22px
        "6": "1.5rem", // 24px
        "9": "2.25rem", // 36px
        "10": "2.5rem", // 40px
        "12": "3.75rem", // 60px
        "20": "5rem", // 80px
        "30": "7.5rem", // 120px
        "40": "10rem", // 160px
        "65": "16.25rem", // 260px
      },
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.25rem", // 20px
      xl: "1.375rem", // 22px
      "2xl": "1.5rem", // 24px
      "3xl": "2.25rem", // 36px
      subheader: "3rem", // 48px
      header: "4.5rem", // 72px
    },
    lineHeight: {
      xs: "0.875rem", // 14px
      sm: "1rem", // 16px
      base: "1.25rem", // 20px
      lg: "1.5rem", // 24px
      xl: "1.75rem", // 28px
      "2xl": "2rem", // 32px
      "3xl": "3rem", // 48px
      subheader: "4rem", // 64px
      header: "5rem", // 80px
    },
    colors: {
      orange: "#fc8f14",
      teal: "#14becb",
      white: "#fefefe",
      nearwhite: "#D8D8D8",
      black: "#32334f",
      midgray: "rgba(50,51,79,0.25)",
      gray: "#979797",
      green: "#14da9e",
      red: "#ff0000",
    },
    fontFamily: {
      sans: [
        "Ubuntu",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        '"Noto Sans"',
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
  },
}
