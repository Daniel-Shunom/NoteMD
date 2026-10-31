/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'fluid-heading': 'clamp(1.5rem, 2.5vw, 2.5rem)',
        'fluid-base': 'clamp(1rem, 1.5vw, 1.25rem)',
      },
    },
  },
  plugins: [],
};
