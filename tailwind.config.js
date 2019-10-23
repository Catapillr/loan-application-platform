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
        "1d5": "0.375rem", // 6px
        "2d5": "0.625rem", // 10px
        "3d5": "0.875rem", // 14px
        "4": "1rem", // 16px
        "4d5": "1.125rem", // 18px
        "5": "1.25rem", // 20px
        "5d5": "1.375rem", // 22px
        "6": "1.5rem", // 24px
        "9": "2.25rem", // 36px
        "9d5": "2.375rem", // 38px
        "10": "2.5rem", // 40px
        "10d5": "2.625rem", // 42px
        "11": "2.75rem", // 44px
        "11d5": "2.875rem", // 46px
        "12": "3.75rem", // 60px
        "17": "4.25rem", // 68px
        "18": "4.5rem", // 72px
        "20": "5rem", // 80px
        "27": "6.75rem", // 108px
        "30": "7.5rem", // 120px
        "40": "10rem", // 160px
        "43": "10.75rem", // 172px
        "65": "16.25rem", // 260px
      },
      width: {
        "49/100": "49%",
      },
      borderRadius: {
        "11": "2.75rem", // 44px
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
      lightgray: "#F0F6FB",
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
    boxShadow: {
      button:
        "0 0 2px 1px rgba(0, 0, 0, 0.03), 0 6px 10px 2px rgba(20, 190, 203, 0.3)",
    },
  },
}
