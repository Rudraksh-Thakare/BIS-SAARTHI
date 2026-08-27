/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom premium palette: deep slate and rich corporate blue
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae2fd',
          300: '#7ccafd',
          400: '#38aef9',
          500: '#0e94eb',
          600: '#0276cb',
          700: '#025ea4',
          800: '#075087',
          900: '#0c4370',
          950: '#082b49',
        },
      },
    },
  },
  plugins: [],
}
