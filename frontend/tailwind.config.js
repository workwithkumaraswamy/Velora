/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        velora: {
          ivory: '#FAF9F6',
          cream: '#FDFCFA',
          beige: '#F4EFEA',
          sand: '#EAE3DA',
          champagne: {
            DEFAULT: '#C5A880',
            light: '#E6D7C3',
            dark: '#A6895F',
            accent: '#D4AF37'
          },
          black: '#111111',
          charcoal: '#222222',
          muted: '#71717A',
          border: '#E8E3DC'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        'luxury-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
