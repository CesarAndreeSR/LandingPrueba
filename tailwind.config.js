/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // INTIHAWUA Brand Colors
        intihawua: {
          blue: {
            base: '#0A58CA',
            light: '#0099FF',
          },
          orange: {
            vibrant: '#FF6600',
            yellow: '#FFAA00',
          },
          dark: '#0B132B',
          gray: '#5C677D',
        },
      },
    },
  },
  plugins: [],
}
