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
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
