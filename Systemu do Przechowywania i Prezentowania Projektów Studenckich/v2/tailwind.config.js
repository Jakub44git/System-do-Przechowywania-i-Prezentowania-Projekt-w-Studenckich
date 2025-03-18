/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ebf5ff',
          100: '#e1effe',
          200: '#c3ddfd',
          300: '#a4cafe',
          400: '#76a9fa',
          500: '#3f83f8',
          600: '#1c64f2',
          700: '#1a56db',
          800: '#1e429f',
          900: '#233876',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f4f5f7',
          200: '#e5e7eb',
          300: '#d2d6dc',
          400: '#9fa6b2',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#252f3f',
          900: '#161e2e',
        },
        success: {
          50: '#f3faf7',
          100: '#def7ec',
          200: '#bcf0da',
          300: '#84e1bc',
          400: '#31c48d',
          500: '#0e9f6e',
          600: '#057a55',
          700: '#046c4e',
          800: '#03543f',
          900: '#014737',
        },
        danger: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#f05252',
          600: '#e02424',
          700: '#c81e1e',
          800: '#9b1c1c',
          900: '#771d1d',
        },
        warning: {
          50: '#fdfdea',
          100: '#fdf6b2',
          200: '#fce96a',
          300: '#faca15',
          400: '#e3a008',
          500: '#c27803',
          600: '#9f580a',
          700: '#8e4b10',
          800: '#723b13',
          900: '#633112',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
      boxShadow: {
        'outline-primary': '0 0 0 3px rgba(164, 202, 254, 0.45)',
        'outline-secondary': '0 0 0 3px rgba(210, 214, 220, 0.45)',
        'outline-success': '0 0 0 3px rgba(132, 225, 188, 0.45)',
        'outline-danger': '0 0 0 3px rgba(248, 180, 180, 0.45)',
        'outline-warning': '0 0 0 3px rgba(252, 233, 106, 0.45)',
      },
      zIndex: {
        '-10': '-10',
        '-20': '-20',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      borderWidth: {
        '3': '3px',
      },
      opacity: {
        '85': '0.85',
        '95': '0.95',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
