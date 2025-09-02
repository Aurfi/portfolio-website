import { ref, onMounted } from 'vue'

interface NetworkConnection {
  effectiveType?: string
  saveData?: boolean
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection
}

interface PerformanceEntryWithFID extends PerformanceEntry {
  processingStart: number
}

interface PerformanceMetrics {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  connectionType: 'slow' | 'fast' | 'unknown'
  supportsWebP: boolean
  supportsAvif: boolean
  prefersReducedMotion: boolean
  prefersReducedData: boolean
  batteryLevel?: number
  isLowEndDevice: boolean
}

export function usePerformanceOptimization() {
  const metrics = ref<PerformanceMetrics>({
    deviceType: 'desktop',
    connectionType: 'unknown',
    supportsWebP: false,
    supportsAvif: false,
    prefersReducedMotion: false,
    prefersReducedData: false,
    isLowEndDevice: false,
  })

  const isOptimized = ref(false)

  const detectDeviceCapabilities = async () => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)

    metrics.value.deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'

    // Detect connection speed
    if ('connection' in navigator) {
      const connection = (navigator as NavigatorWithConnection).connection
      const effectiveType = connection?.effectiveType

      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        metrics.value.connectionType = 'slow'
      } else if (effectiveType === '3g' || effectiveType === '4g') {
        metrics.value.connectionType = 'fast'
      }
    }

    // Check image format support
    metrics.value.supportsWebP = await checkImageFormatSupport('webp')
    metrics.value.supportsAvif = await checkImageFormatSupport('avif')

    // Check user preferences
    metrics.value.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    metrics.value.prefersReducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches

    // Detect low-end device
    metrics.value.isLowEndDevice = detectLowEndDevice()

    // Get battery level if available
    if ('getBattery' in navigator) {
      try {
        const navigatorWithBattery = navigator as Navigator & {
          getBattery(): Promise<{ level: number }>
        }
        const battery = await navigatorWithBattery.getBattery()
        metrics.value.batteryLevel = battery.level
      } catch {
        console.log('Battery API not available')
      }
    }
  }

  const checkImageFormatSupport = (format: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)

      const testImages = {
        webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
      }

      img.src = testImages[format as keyof typeof testImages] || ''
    })
  }

  const detectLowEndDevice = (): boolean => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 1

    // Check memory (if available)
    const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number }
    const memory = navigatorWithMemory.deviceMemory || 4

    // Check if device is likely low-end
    return cores <= 2 || memory <= 2
  }

  const optimizeForDevice = () => {
    const { deviceType, connectionType, isLowEndDevice, prefersReducedMotion, prefersReducedData } =
      metrics.value

    // Apply device-specific optimizations
    document.documentElement.setAttribute('data-device-type', deviceType)
    document.documentElement.setAttribute('data-connection', connectionType)

    if (isLowEndDevice) {
      document.documentElement.setAttribute('data-low-end-device', 'true')
    }

    if (prefersReducedMotion) {
      document.documentElement.setAttribute('data-reduced-motion', 'true')
    }

    if (prefersReducedData) {
      document.documentElement.setAttribute('data-reduced-data', 'true')
    }

    // Optimize images based on device capabilities
    optimizeImages()

    // Optimize animations
    optimizeAnimations()

    // Optimize loading strategies
    optimizeLoading()

    isOptimized.value = true
  }

  const optimizeImages = () => {
    const images = document.querySelectorAll('img[data-src], img[src]')

    images.forEach((img) => {
      const image = img as HTMLImageElement

      // Use appropriate image format
      if (metrics.value.supportsAvif && image.dataset.avif) {
        image.src = image.dataset.avif
      } else if (metrics.value.supportsWebP && image.dataset.webp) {
        image.src = image.dataset.webp
      }

      // Reduce image quality for slow connections or low-end devices
      if (metrics.value.connectionType === 'slow' || metrics.value.isLowEndDevice) {
        if (image.dataset.lowQuality) {
          image.src = image.dataset.lowQuality
        }
      }

      // Add loading optimization
      if ('loading' in HTMLImageElement.prototype) {
        image.loading = 'lazy'
      }
    })
  }

  const optimizeAnimations = () => {
    if (metrics.value.prefersReducedMotion || metrics.value.isLowEndDevice) {
      // Disable or reduce animations
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      document.documentElement.style.setProperty('--transition-duration', '0.01ms')
    } else if (metrics.value.connectionType === 'slow') {
      // Reduce animation complexity
      document.documentElement.style.setProperty('--animation-duration', '0.2s')
      document.documentElement.style.setProperty('--transition-duration', '0.2s')
    }
  }

  const optimizeLoading = () => {
    // Implement adaptive loading based on device capabilities
    if (metrics.value.connectionType === 'slow' || metrics.value.prefersReducedData) {
      // Defer non-critical resources
      deferNonCriticalResources()
    }

    if (metrics.value.isLowEndDevice) {
      // Reduce JavaScript bundle size by code splitting
      enableCodeSplitting()
    }
  }

  const deferNonCriticalResources = () => {
    // Defer loading of non-critical CSS
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-defer]')
    nonCriticalCSS.forEach((link) => {
      const linkElement = link as HTMLLinkElement
      linkElement.media = 'print'
      linkElement.onload = () => {
        linkElement.media = 'all'
      }
    })

    // Defer loading of non-critical JavaScript
    const nonCriticalJS = document.querySelectorAll('script[data-defer]')
    nonCriticalJS.forEach((script) => {
      const scriptElement = script as HTMLScriptElement
      scriptElement.defer = true
    })
  }

  const enableCodeSplitting = () => {
    // This would typically be handled by the build system
    // But we can provide hints to the browser
    const navigatorWithConnection = navigator as NavigatorWithConnection
    if ('connection' in navigatorWithConnection && navigatorWithConnection.connection) {
      const connection = navigatorWithConnection.connection
      if (connection.saveData) {
        document.documentElement.setAttribute('data-save-data', 'true')
      }
    }
  }

  const addCriticalCSS = (css: string) => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
  }

  const preloadCriticalResources = (resources: string[]) => {
    resources.forEach((resource) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource

      if (resource.endsWith('.css')) {
        link.as = 'style'
      } else if (resource.endsWith('.js')) {
        link.as = 'script'
      } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        link.as = 'image'
      }

      document.head.appendChild(link)
    })
  }

  const monitorPerformance = () => {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]

        if (typeof gtag !== 'undefined') {
          gtag('event', 'LCP', {
            event_category: 'Web Vitals',
            value: Math.round(lastEntry.startTime),
            custom_map: {
              device_type: metrics.value.deviceType,
              connection_type: metrics.value.connectionType,
            },
          })
        }
      })

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'FID', {
              event_category: 'Web Vitals',
              value: Math.round(
                (entry as PerformanceEntryWithFID).processingStart - entry.startTime
              ),
              custom_map: {
                device_type: metrics.value.deviceType,
                connection_type: metrics.value.connectionType,
              },
            })
          }
        })
      })

      fidObserver.observe({ entryTypes: ['first-input'] })
    }
  }

  onMounted(async () => {
    await detectDeviceCapabilities()
    optimizeForDevice()
    monitorPerformance()
  })

  return {
    metrics,
    isOptimized,
    detectDeviceCapabilities,
    optimizeForDevice,
    addCriticalCSS,
    preloadCriticalResources,
    monitorPerformance,
  }
}
