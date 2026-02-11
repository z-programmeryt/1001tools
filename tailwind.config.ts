import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bgDark: '#0f0f23',
        bgLight: '#f8fafc',
        primary: '#4F46E5',
        violet: '#7C3AED',
        cyan: '#06B6D4',
        emerald: '#10B981',
        rose: '#F43F5E',
        amber: '#F59E0B'
      },
      boxShadow: {
        glass: '0 20px 40px rgba(15,23,42,.15)'
      }
    }
  },
  plugins: []
} satisfies Config;
