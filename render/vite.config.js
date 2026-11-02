import { sveltekit } from '@sveltejs/kit/vite';
import config from './kit.config.js';
export default { plugins: [sveltekit(config)] };
