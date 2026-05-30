// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Explicitly setting this to false to avoid the missing field error in some Vite/Tailwind versions
      // @ts-ignore
      tsconfigPaths: false
    }
  },

  adapter: node({
    mode: 'standalone'
  })
});