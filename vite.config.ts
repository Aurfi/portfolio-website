import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import legacy from '@vitejs/plugin-legacy'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // Enable script setup and other optimizations
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),
    // Only include devtools in development
    ...(process.env.NODE_ENV === 'development' ? [vueDevTools()] : []),
    // Legacy browser support with polyfills
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all',
      ],
    }),
    // Gzip compression for production
    ...(process.env.NODE_ENV === 'production'
      ? [
          compression({
            algorithm: 'gzip',
            ext: '.gz',
          }),
          compression({
            algorithm: 'brotliCompress',
            ext: '.br',
          }),
          // Bundle analyzer
          visualizer({
            filename: 'dist/stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
      },
    },
    cssTarget: 'chrome80', // Better CSS support
    reportCompressedSize: true, // Report compressed size
    rollupOptions: {
      output: {
        // Enhanced code splitting for better caching and performance
        manualChunks: (id) => {
          // Vendor chunks - more granular splitting
          if (id.includes('node_modules')) {
            // Core Vue ecosystem
            if (id.includes('vue') && !id.includes('vue-router') && !id.includes('vue-i18n')) {
              return 'vue-vendor'
            }
            if (id.includes('vue-router')) {
              return 'router-vendor'
            }
            if (id.includes('pinia')) {
              return 'pinia-vendor'
            }
            if (id.includes('vue-i18n')) {
              return 'i18n-vendor'
            }

            // Analytics and performance
            if (id.includes('web-vitals')) {
              return 'analytics-vendor'
            }

            // Large libraries that should be separate
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-vendor'
            }

            // Utility libraries
            if (id.includes('lodash') || id.includes('date-fns') || id.includes('uuid')) {
              return 'utils-vendor'
            }

            // Everything else
            return 'vendor'
          }

          // Component chunks - more specific splitting
          if (id.includes('/components/')) {
            if (id.includes('/projects/')) {
              return 'projects-components'
            }
            if (id.includes('/sections/')) {
              return 'sections-components'
            }
            if (id.includes('/ui/')) {
              return 'ui-components'
            }
            if (id.includes('/layout/')) {
              return 'layout-components'
            }
            return 'components'
          }

          // Composables chunk
          if (id.includes('/composables/')) {
            return 'composables'
          }

          // Utils chunk
          if (id.includes('/utils/')) {
            return 'utils'
          }
        },
        // Ensure consistent file naming for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash].[ext]`
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash].[ext]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash].[ext]`
          }
          return `assets/[name]-[hash].[ext]`
        },
      },
      // External dependencies that should not be bundled
      external: (id) => {
        // Keep service worker external
        return id === '/sw.js'
      },
    },
    // Increase chunk size warning limit for vendor bundles
    chunkSizeWarningLimit: 500,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },

  // CSS optimization
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`,
      },
    },
  },

  // Optimization options
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
    exclude: [
      'web-vitals', // Load dynamically
    ],
  },

  // Preview server configuration for local testing
  preview: {
    port: 4173,
    host: true,
    // Serve with the same base path as production for accurate testing
    ...(process.env.NODE_ENV === 'production' && {
      base: '/portfolio-website/',
    }),
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    open: true,
    // Optimize HMR
    hmr: {
      overlay: true,
    },
  },

  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      }
      return { relative: true }
    },
  },

  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/dist/**',
        '**/.{idea,git,cache,output,temp}/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    // Mock browser APIs
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi'],
    },
  },
})
