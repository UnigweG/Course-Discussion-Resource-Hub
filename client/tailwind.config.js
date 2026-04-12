/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // "class" strategy lets us toggle dark mode by adding/removing
  // the "dark" class on the <html> element via ThemeContext.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors are driven by CSS custom properties so the active
        // theme (indigo / blue / green / rose) takes effect at runtime
        // without any rebuild.  Tailwind's <alpha-value> placeholder
        // preserves opacity utilities like bg-brand-600/50.
        brand: {
          50:  'rgb(var(--brand-50)  / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                                  to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' },   to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
