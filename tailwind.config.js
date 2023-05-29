/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["DM Mono", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        gold: "#FC8370",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
