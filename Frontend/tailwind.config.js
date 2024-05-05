/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        "custom-blue-100": "#F6F8FA",
        "custom-blue-200": "#DADFF8",
        "custom-blue-300": "#8396E7",
        "custom-grey-100": "#EAEEF2",
        "custom-grey-200": "#F3F4F7",
        "primary-color": "#4561DB",
        "color-text-one": "#050505",
        "color-text-two": "#828DA9",
        "color-text-three": "#2E4192",
        "color-dark-red": "#D6236A",
        "color-light-red": "#F7D3E1",
        "color-dark-green": "#2FA52D",
        "divider-grey": "#CCD0DC",
      },
      borderWidth: {
        1.5: "1.5px",
        0.6: "0.6px",
        0.5: "0.5px",
      },
      borderColor: (theme) => ({
        ...theme("colors"),
        "test-border": "red",
        "custom-color-one": "#E2E4EB",
        "custom-color-two": "#8396E7",
      }),
      boxShadow: {
        "custom-100": "2px 2px 6px 0px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  corePlugins: {
    fontFamily: false, // Disable the default fontFamily core plugin
  },
  variants: {
    fontFamily: ["responsive", "hover", "focus"], // Enable fontFamily utility with responsive and hover variants
  },
};
