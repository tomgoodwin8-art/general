/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAFA',
        ink: '#111111',
        accent: '#0E4F4A',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '640px',
        wide: '960px',
      },
    },
  },
  plugins: [],
};
