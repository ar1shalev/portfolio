import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    minify: false, // Disable minification
    // Output directory for the build
    outDir: 'docs',
    // Set this to false to prevent clearing the output directory before building
    emptyOutDir: true,
    // Copy additional files to the output directory
    assetsInlineLimit: 0, // Disable inlining assets as base64
    rollupOptions: {
      // Preserve the directory structure when copying files
      input: {
        main: resolve(__dirname, "index.html"),
        english: resolve(__dirname, "resume/english.html"),
        hebrew: resolve(__dirname, "resume/hebrew.html"),
      },
      output: {
        assetFileNames: '[name][extname]',
      },
    },
  },

  // Custom configuration to copy HTML files
  optimizeDeps: {
    include: ['*.html'],
  },
});

