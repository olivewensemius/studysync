import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#65bff9',
          400: '#40a9ff',
          500: '#1890ff',  // Main brand blue
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766'
        },
        'accent': {
          50: '#e6fffb',
          100: '#b5f5ec',
          200: '#87e8de',
          300: '#5cdbd3',
          400: '#36cfc9',
          500: '#13c2c2',  // Teal accent
          600: '#08979c',
          700: '#006d75',
          800: '#00474f',
          900: '#002329'
        },
        'secondary': {
          50: '#f0f7ff',
          100: '#d8e6ff',
          200: '#baccf0',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#4e6af2',  // Secondary blue
          600: '#3f51d8',
          700: '#303fb5',
          800: '#1d2b8f',
          900: '#14225c'
        },
        'neutral': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      fontFamily: {
        'sans': ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['var(--font-display)', 'Manrope', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(24, 144, 255, 0.3)',
        'blue': '0 4px 14px 0 rgba(24, 144, 255, 0.39)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'blue-gradient': 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
      }
    },
  },
  plugins: [],
}