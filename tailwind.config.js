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
        glowPink:
          "0 10px 15px -3px rgb(219 39 119/0.1), 0 4px 6px -4px rgb(219 39 119/0.1);",
        glowWhite: "0 5px 7px -4px rgb(100 100 100/.1);",
        glowGreen: "0 5px 5px -3px rgb(11 64 30/0.3);",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
