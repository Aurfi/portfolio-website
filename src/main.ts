import './assets/styles/global.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { injectAccessibilityStyles } from './composables/useAccessibility'
import { setupGlobalErrorHandler } from './composables/useErrorHandler'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

// Inject accessibility styles
injectAccessibilityStyles()

// Setup global error handler
setupGlobalErrorHandler()

app.mount('#app')

// Run quality assurance checks in development
if (import.meta.env.DEV) {
  import('./utils/accessibilityTest').then(({ logAccessibilityIssues }) => {
    // Run accessibility audit after DOM is ready
    setTimeout(() => {
      logAccessibilityIssues()
    }, 1000)
  })

  import('./utils/qualityAssurance').then(({ runQualityAssurance, logQualityReport }) => {
    // Run comprehensive quality assurance after page load
    setTimeout(async () => {
      const report = await runQualityAssurance()
      logQualityReport(report)
    }, 2000)
  })
}

// Initialize PWA functionality
if (typeof window !== 'undefined') {
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        console.log('SW registered: ', registration)
      } catch (registrationError) {
        console.log('SW registration failed: ', registrationError)
      }
    })
  }

  // Initialize Web Vitals monitoring
  const initWebVitals = async () => {
    try {
      const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals')

      const sendToAnalytics = (metric: { name: string; value: number; id?: string }) => {
        console.log('Web Vital:', metric.name, metric.value)

        // Send to analytics service (Google Analytics example)
        if (typeof gtag !== 'undefined') {
          gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true,
          })
        }
      }

      onCLS(sendToAnalytics)
      onFCP(sendToAnalytics)
      onLCP(sendToAnalytics)
      onTTFB(sendToAnalytics)
    } catch (error) {
      console.warn('Web Vitals not available:', error)
    }
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebVitals)
  } else {
    initWebVitals()
  }
}
