/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#FAFAFB',
        ink: '#141414',
        accent: '#2E5A8C',
      },
      fontFamily: {
        serif: ['Fraunces Variable', 'Georgia', 'serif'],
        sans: ['Inter Variable', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '640px',
        wide: '960px',
      },
    },
  },
  plugins: [],
};
