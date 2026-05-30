import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [
      // @ts-ignore
      tailwindcss()
    ],
    resolve: {
      // Explicitly setting this to false to avoid the missing field error in some Vite/Tailwind versions
      // @ts-ignore
      tsconfigPaths: false
    }
  }
});
