import { resolve } from 'node:path';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({ extensions: ['.svx'], layout: { runbook: resolve(import.meta.dirname, 'src/lib/layouts/runbook.svelte') } }),
  ],
  adapter: adapter({ strict: false }),
  alias: { '#lib': 'src/lib', '#lib/*': 'src/lib/*' },
  prerender: {
    entries: ['/kb/', '/kb/incidents/4471-three-problems/', '/kb/incidents/4471/', '/kb/triage/dedupe/', '/kb/decisions/0001-dedupe-by-subject/'],
    handleHttpError: 'warn',
  },
};
export default config;
