/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        primary: 'var(--color-primary)',      // Rose gold / Deep rose gold
        secondary: 'var(--color-secondary)',  // Platinum / Deep platinum
        warm: 'var(--color-warm)',            // Warm accent colors
        platinum: 'var(--color-secondary)',   // Alias for backward compat
        pearl: 'var(--color-text-primary)',   // Pearl/Primary text
      },
      backgroundColor: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
      },
      borderColor: {
        base: 'var(--color-border)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(to right, var(--color-background), var(--color-surface), var(--color-background))',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'shine': 'shine 2.2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shine: {
          '0%': { transform: 'translateX(-110%)' },
          '50%': { transform: 'translateX(110%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      }
    },
  },
  plugins: [],
}
