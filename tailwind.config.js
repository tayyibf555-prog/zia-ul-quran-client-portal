/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        azen: {
          bg: '#020817', // Main Deep Background
          'secondary-bg': '#07173A', // Secondary Dark Blue
          card: '#0b1836', // Card Background
          'card-alt': '#131a2f', // Receptionist Card Background
          border: '#1E293B', // Border color
          primary: '#22d3ee', // Cyan Accent
          secondary: '#34d399', // Emerald Accent
          'button-text': '#062035', // Button Text (Dark Blue)
          text: '#F8FAFC',
          muted: '#94A3B8',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(6, 182, 212, 0.15)',
        'glow-strong': '0 0 30px rgba(6, 182, 212, 0.3)',
      }
    },
  },
  plugins: [],
}
