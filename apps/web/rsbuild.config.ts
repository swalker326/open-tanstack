import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/rspack';
import { withZephyr } from 'zephyr-rsbuild-plugin';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact(), withZephyr()],
  source: {
    define: {
      'import.meta.env.API_URL': JSON.stringify(
        process.env.API_URL ?? 'http://localhost:8787',
      ),
      'import.meta.env.ISSUER_URL': JSON.stringify(
        process.env.ISSUER_URL ?? 'http://localhost:8788',
      ),
    },
  },
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: 'react',
          autoCodeSplitting: true,
        }),
      ],
    },
  },
});
