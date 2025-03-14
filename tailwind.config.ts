// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary blue
        'primary': {
          50: '#e6f1fe',
          100: '#c0d9fc',
          200: '#9ac1fa',
          300: '#74a9f8',
          400: '#4e91f6',
          500: '#3b82f6',  // Main color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        // Accent green
        'accent': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Main color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        },
        // Secondary muted slate/purple
        'secondary': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        // Dark theme specific colors
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'card': {
          'bg': 'var(--card-bg)',
          'border': 'var(--card-border)',
        },
        'text': {
          'primary': 'var(--text-primary)',
          'secondary': 'var(--text-secondary)',
          'muted': 'var(--text-muted)',
        }
      },
      fontFamily: {
        'sans': ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['var(--font-display)', 'Manrope', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'medium': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px rgba(59, 130, 246, 0.3)',
        'accent-glow': '0 0 15px rgba(16, 185, 129, 0.3)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-gradient': 'linear-gradient(to right, #1e293b, #111827)',
        'blue-gradient': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'green-gradient': 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
      }
    },
  },
  plugins: [],
}

export default config;