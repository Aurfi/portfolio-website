import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Only include devtools in development
    ...(process.env.NODE_ENV === 'development' ? [vueDevTools()] : [])
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Configure base URL for GitHub Pages deployment
  // In production, GitHub Pages serves from /repository-name/ subdirectory
  // In development, serve from root for local testing
  base: process.env.NODE_ENV === 'production' ? '/portfolio-website/' : '/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Enable source maps for debugging in production
    sourcemap: true,
    // Optimize build for GitHub Pages
    minify: 'esbuild',
    target: 'es2015',
    rollupOptions: {
      output: {
        // Code splitting for better caching and performance
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          i18n: ['vue-i18n']
        },
        // Ensure consistent file naming for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit for vendor bundles
    chunkSizeWarningLimit: 1000
  },
  
  // Preview server configuration for local testing
  preview: {
    port: 4173,
    host: true,
    // Serve with the same base path as production for accurate testing
    ...(process.env.NODE_ENV === 'production' && {
      base: '/portfolio-website/'
    })
  },
  
  // Development server configuration
  server: {
    port: 5173,
    host: true,
    open: true
  }
})
