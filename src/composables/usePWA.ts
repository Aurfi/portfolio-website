import { ref, onMounted, onUnmounted } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  updateAvailable: boolean
  registration: ServiceWorkerRegistration | null
}

export function usePWA() {
  const state = ref<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    updateAvailable: false,
    registration: null,
  })

  let deferredPrompt: BeforeInstallPromptEvent | null = null

  // Register service worker
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        state.value.registration = registration

        console.log('Service Worker registered successfully:', registration)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                state.value.updateAvailable = true
                console.log('New service worker available')
              }
            })
          }
        })

        // Handle controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })

        return registration
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        return null
      }
    }
    return null
  }

  // Install PWA
  const installPWA = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choiceResult = await deferredPrompt.userChoice

        if (choiceResult.outcome === 'accepted') {
          console.log('PWA installation accepted')
          state.value.isInstalled = true
        } else {
          console.log('PWA installation dismissed')
        }

        deferredPrompt = null
        state.value.isInstallable = false
      } catch (error) {
        console.error('PWA installation failed:', error)
      }
    }
  }

  // Update service worker
  const updateServiceWorker = async () => {
    if (state.value.registration) {
      try {
        await state.value.registration.update()

        // Skip waiting and activate new service worker
        const newWorker = state.value.registration.waiting
        if (newWorker) {
          newWorker.postMessage({ type: 'SKIP_WAITING' })
        }
      } catch (error) {
        console.error('Service Worker update failed:', error)
      }
    }
  }

  // Check if PWA is installed
  const checkInstallation = () => {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
    const isIOSStandalone = navigatorWithStandalone.standalone === true

    state.value.isInstalled = isStandalone || isIOSStandalone
  }

  // Handle online/offline status
  const handleOnlineStatus = () => {
    state.value.isOnline = navigator.onLine
  }

  // Handle beforeinstallprompt event
  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    state.value.isInstallable = true
    console.log('PWA install prompt available')
  }

  // Handle app installed event
  const handleAppInstalled = () => {
    console.log('PWA was installed')
    state.value.isInstalled = true
    state.value.isInstallable = false
    deferredPrompt = null
  }

  onMounted(() => {
    // Register service worker
    registerServiceWorker()

    // Check installation status
    checkInstallation()

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    // Check for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkInstallation)
  })

  onUnmounted(() => {
    // Remove event listeners
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
    window.removeEventListener('online', handleOnlineStatus)
    window.removeEventListener('offline', handleOnlineStatus)
  })

  return {
    state: state.value,
    installPWA,
    updateServiceWorker,
    registerServiceWorker,
  }
}

// Core Web Vitals monitoring
interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

export function useWebVitals() {
  const metrics = ref<WebVitalsMetric[]>([])

  const sendToAnalytics = (metric: WebVitalsMetric) => {
    // Send to your analytics service
    console.log('Web Vital:', metric)

    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }
  }

  const measureWebVitals = async () => {
    try {
      // Dynamic import to avoid loading if not needed
      const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals')

      // Cumulative Layout Shift
      onCLS((metric) => {
        const webVital: WebVitalsMetric = {
          name: 'CLS',
          value: metric.value,
          rating:
            metric.value <= 0.1 ? 'good' : metric.value <= 0.25 ? 'needs-improvement' : 'poor',
          delta: metric.delta,
          id: metric.id,
        }
        metrics.value.push(webVital)
        sendToAnalytics(webVital)
      })

      // Note: FID (First Input Delay) has been replaced by INP (Interaction to Next Paint) in web-vitals v4+

      // First Contentful Paint
      onFCP((metric) => {
        const webVital: WebVitalsMetric = {
          name: 'FCP',
          value: metric.value,
          rating:
            metric.value <= 1800 ? 'good' : metric.value <= 3000 ? 'needs-improvement' : 'poor',
          delta: metric.delta,
          id: metric.id,
        }
        metrics.value.push(webVital)
        sendToAnalytics(webVital)
      })

      // Largest Contentful Paint
      onLCP((metric) => {
        const webVital: WebVitalsMetric = {
          name: 'LCP',
          value: metric.value,
          rating:
            metric.value <= 2500 ? 'good' : metric.value <= 4000 ? 'needs-improvement' : 'poor',
          delta: metric.delta,
          id: metric.id,
        }
        metrics.value.push(webVital)
        sendToAnalytics(webVital)
      })

      // Time to First Byte
      onTTFB((metric) => {
        const webVital: WebVitalsMetric = {
          name: 'TTFB',
          value: metric.value,
          rating:
            metric.value <= 800 ? 'good' : metric.value <= 1800 ? 'needs-improvement' : 'poor',
          delta: metric.delta,
          id: metric.id,
        }
        metrics.value.push(webVital)
        sendToAnalytics(webVital)
      })
    } catch (error) {
      console.warn('Web Vitals library not available:', error)
    }
  }

  onMounted(() => {
    measureWebVitals()
  })

  return {
    metrics: metrics.value,
  }
}
