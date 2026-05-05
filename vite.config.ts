// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// Cloudflare plugin is disabled for Vercel deployment - use conditional environment detection
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Disable Cloudflare plugin for Vercel deployment
const config = defineConfig();

if (process.env.VERCEL === 'true') {
  // Remove cloudflare plugin when deploying to Vercel
  config.plugins = config.plugins?.filter((plugin: any) => 
    !plugin.name?.includes('cloudflare')
  ) || [];
}

export default config;