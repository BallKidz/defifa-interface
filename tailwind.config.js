/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Capsules", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        violet: {
          1000: "#1B093B",
          1100: "#121013",
        },
      },
      boxShadow: {
        glow: "0 10px 15px -3px rgb(46 16 101/0.5), 0 4px 6px -4px rgb(46 16 101/0.5);",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
