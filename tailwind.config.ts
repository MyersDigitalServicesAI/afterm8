import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7fe',
          300: '#a4bcfd',
          400: '#7b97fa',
          500: '#5b73f5',
          600: '#4353eb',
          700: '#3640d6',
          800: '#2d35ae',
          900: '#2a3189',
          950: '#1a1f54',
        },
        surface: {
          DEFAULT: '#0d0f1a',
          card:    '#131628',
          border:  '#1e2240',
          hover:   '#1a1f3d',
        },
      },
      backgroundImage: {
        'hero-gradient':  'linear-gradient(135deg, #0d0f1a 0%, #131a2e 50%, #0d0f1a 100%)',
        'brand-gradient': 'linear-gradient(135deg, #5b73f5 0%, #7b97fa 100%)',
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up':  'fadeInUp 0.5s ease-out forwards',
        'fade-in':     'fadeIn 0.3s ease-out forwards',
        'shimmer':     'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'brand-sm': '0 0 15px rgba(91, 115, 245, 0.15)',
        'brand-md': '0 0 30px rgba(91, 115, 245, 0.20)',
        'brand-lg': '0 0 60px rgba(91, 115, 245, 0.25)',
        'card':     '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

export default config
