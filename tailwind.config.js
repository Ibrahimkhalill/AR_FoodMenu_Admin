/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Add custom colors here
        primary: "#FFDC58", // Gold
        secondary: "#1E90FF", // Dodger Blue
        accent: "#FF4500", // Orange Red
        sidebar: "#F1E9C8",
      },
    },
  },
  plugins: [],
};
