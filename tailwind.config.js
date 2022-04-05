const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.jsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: [`"Montserrat"`, ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
      },
    },
  },
  plugins: [],
};
