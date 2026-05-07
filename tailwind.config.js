/** @type {import('tailwindcss').Config} */

// 🎨 BRAND: Change 'accent' to your brand color.
// All NativeWind classes using bg-accent, text-accent, border-accent update automatically.
// Also update Theme.accent in lib/theme.ts to match.

module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0a0a14',
        accent: '#F59E0B',      // 🎨 AI Town warm amber
        surface: '#13131f',
        surface2: '#1c1c2e',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
}
