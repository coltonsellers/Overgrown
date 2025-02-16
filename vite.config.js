import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        }
      ],
    }),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './popup.html',
        background: './src/background/background.js', // Entry point for background script
        content: './src/content/content.js', // Entry point for content script

      },
      output: {
        entryFileNames: '[name].js', // Output files: background.js, content.js, main.js
        assetFileNames: 'assets/[name].[ext]', // Output assets (e.g., CSS, images)
      }
    },
  },
});
