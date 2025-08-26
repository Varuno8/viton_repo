import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        accent: '#0EA5E9',
        border: 'rgba(255,255,255,0.08)'
      },
      boxShadow: {
        'lg/10': '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1)',
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(to bottom right, #0b0f14, #0e141b)'
      }
    },
  },
  plugins: [],
}
export default config
