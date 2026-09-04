/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Core palette - intentional, minimal
        ink:    '#0a0a0a',   // near-black, sharper than #1c1c1e
        muted:  '#717171',   // accessible gray, WCAG AA on white
        faint:  '#f9f9f9',   // off-white surface
        stone:  '#ebebeb',   // neutral border, no warm tint
        accent: '#5b4cf5',   // violet - deeper, more intentional than #6d4aff

        // Semantic aliases
        surface: '#ffffff',
        'surface-raised': '#f4f4f5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)',
        float: '0 8px 32px rgba(0,0,0,0.12)',
        sm:    '0 1px 3px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'scale(0.97) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1)   translateY(0)'    },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
      },
      animation: {
        'fade-in':  'fade-in 0.18s ease-out both',
        'slide-up': 'slide-up 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
