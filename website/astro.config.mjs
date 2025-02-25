// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://26d0.github.io',
  base: '/vrchat-ime-chat',
  output: 'static',
  integrations: [tailwind()],
});
