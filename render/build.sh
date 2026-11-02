#!/bin/sh
# Renders the kb as the desk sees it: copies ../src next to this file, adds the SvelteKit shell, builds to ../rendered.
set -e
cd "$(dirname "$0")"
rm -rf src build .svelte-kit
cp -R ../src ./src
cp -R overlay/src/. ./src/
npm install --no-audit --no-fund
npx vite build
rm -rf ../rendered && cp -R build ../rendered
