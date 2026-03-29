/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        copy: ['Inter_400Regular'],
        body: ['Inter_400Regular'],
        medium: ['Inter_500Medium'],
        ui: ['Inter_600SemiBold'],
        heading: ['Inter_700Bold'],
      },
      colors: {
        background: '#0F0F14',
        surface: '#1A1A22',
        elevated: '#22222C',
        border: '#2E2E38',
        accent: '#FF8A00',
        accentSoft: '#FFB347',
        health: '#4CAF50',
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#6B7280',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      boxShadow: {
        float: '0px 12px 32px rgba(0, 0, 0, 0.28)',
        soft: '0px 8px 24px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [],
};
