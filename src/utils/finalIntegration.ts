// Final integration and polish utilities

// Type definitions for better type safety
interface HTMLElementWithSrc extends HTMLElement {
  src?: string
  href?: string
}

interface PerformanceMetric {
  name: string
  value: number
  context?: Record<string, unknown>
  timestamp: number
  url: string
}

interface ErrorData {
  type: string
  details: Record<string, unknown>
  timestamp: string
  userAgent: string
  url: string
  viewport: {
    width: number
    height: number
  }
}

interface NetworkConnection {
  effectiveType?: string
  saveData?: boolean
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkConnection
}

interface WindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void
}

interface PerformanceEntryWithFID extends PerformanceEntry {
  processingStart: number
}

interface PerformanceEntryWithCLS extends PerformanceEntry {
  hadRecentInput: boolean
  value: number
}

interface IntegrationConfig {
  enableAnalytics: boolean
  enablePerformanceMonitoring: boolean
  enableErrorTracking: boolean
  enableA11yEnhancements: boolean
  enableSmoothScrolling: boolean
}

interface AnalyticsConfig {
  trackingId?: string
  enablePageViews: boolean
  enableEvents: boolean
  enableUserTiming: boolean
}

interface ErrorTrackingConfig {
  enableConsoleErrors: boolean
  enableUnhandledRejections: boolean
  enableResourceErrors: boolean
  maxErrors: number
}

export class FinalIntegration {
  private config: IntegrationConfig
  private analyticsConfig: AnalyticsConfig
  private errorTrackingConfig: ErrorTrackingConfig
  private initialized = false

  constructor(config: Partial<IntegrationConfig> = {}) {
    this.config = {
      enableAnalytics: true,
      enablePerformanceMonitoring: true,
      enableErrorTracking: true,
      enableA11yEnhancements: true,
      enableSmoothScrolling: true,
      ...config,
    }

    this.analyticsConfig = {
      enablePageViews: true,
      enableEvents: true,
      enableUserTiming: true,
    }

    this.errorTrackingConfig = {
      enableConsoleErrors: true,
      enableUnhandledRejections: true,
      enableResourceErrors: true,
      maxErrors: 50,
    }
  }

  /**
   * Initialize all integration features
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('FinalIntegration already initialized')
      return
    }

    try {
      console.log('🚀 Initializing final integration features...')

      // Initialize core features
      if (this.config.enableSmoothScrolling) {
        this.initializeSmoothScrolling()
      }

      if (this.config.enableA11yEnhancements) {
        this.initializeA11yEnhancements()
      }

      if (this.config.enableErrorTracking) {
        this.initializeErrorTracking()
      }

      if (this.config.enablePerformanceMonitoring) {
        await this.initializePerformanceMonitoring()
      }

      if (this.config.enableAnalytics) {
        await this.initializeAnalytics()
      }

      // Initialize cross-browser compatibility
      this.initializeCrossBrowserSupport()

      // Initialize mobile optimizations
      this.initializeMobileOptimizations()

      // Initialize graceful degradation
      this.initializeGracefulDegradation()

      this.initialized = true
      console.log('✅ Final integration completed successfully')

      // Dispatch integration complete event
      window.dispatchEvent(
        new CustomEvent('portfolio:integration:complete', {
          detail: { config: this.config },
        })
      )
    } catch (error) {
      console.error('❌ Failed to initialize final integration:', error)
      throw error
    }
  }

  /**
   * Initialize smooth scrolling behavior
   */
  private initializeSmoothScrolling(): void {
    // Add smooth scrolling CSS if not already present
    if (!document.querySelector('#smooth-scroll-styles')) {
      const style = document.createElement('style')
      style.id = 'smooth-scroll-styles'
      style.textContent = `
        html {
          scroll-behavior: smooth;
        }
        
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `
      document.head.appendChild(style)
    }

    // Enhanced smooth scrolling for internal links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement

      if (link && link.hash) {
        const targetElement = document.querySelector(link.hash)
        if (targetElement) {
          event.preventDefault()

          // Check for reduced motion preference
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

          targetElement.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          })

          // Update URL without triggering navigation
          history.pushState(null, '', link.hash)
        }
      }
    })

    console.log('✅ Smooth scrolling initialized')
  }

  /**
   * Initialize accessibility enhancements
   */
  private initializeA11yEnhancements(): void {
    // Focus management for dynamic content
    this.initializeFocusManagement()

    // Keyboard navigation enhancements
    this.initializeKeyboardNavigation()

    // Screen reader announcements
    this.initializeScreenReaderAnnouncements()

    // High contrast mode detection
    this.initializeHighContrastSupport()

    console.log('✅ Accessibility enhancements initialized')
  }

  /**
   * Initialize focus management
   */
  private initializeFocusManagement(): void {
    // Skip to main content link
    if (!document.querySelector('#skip-to-main')) {
      const skipLink = document.createElement('a')
      skipLink.id = 'skip-to-main'
      skipLink.href = '#main-content'
      skipLink.textContent = 'Skip to main content'
      skipLink.className =
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded'
      document.body.insertBefore(skipLink, document.body.firstChild)
    }

    // Focus trap for modals
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const modal = document.querySelector('[role="dialog"][aria-modal="true"]')
        if (modal) {
          this.trapFocus(event, modal as HTMLElement)
        }
      }
    })
  }

  /**
   * Trap focus within an element
   */
  private trapFocus(event: KeyboardEvent, element: HTMLElement): void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  /**
   * Initialize keyboard navigation
   */
  private initializeKeyboardNavigation(): void {
    // Escape key to close modals
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"][aria-modal="true"]')
        if (modal) {
          const closeButton = modal.querySelector('[data-close-modal]') as HTMLElement
          if (closeButton) {
            closeButton.click()
          }
        }
      }
    })

    // Arrow key navigation for carousels/galleries
    document.addEventListener('keydown', (event) => {
      const carousel = document.querySelector('[role="region"][aria-label*="carousel"]')
      if (carousel && carousel.contains(event.target as Node)) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          // Dispatch custom event for carousel navigation
          carousel.dispatchEvent(
            new CustomEvent('carousel:navigate', {
              detail: { direction: event.key === 'ArrowLeft' ? 'prev' : 'next' },
            })
          )
        }
      }
    })
  }

  /**
   * Initialize screen reader announcements
   */
  private initializeScreenReaderAnnouncements(): void {
    // Create live region for announcements
    if (!document.querySelector('#sr-announcements')) {
      const liveRegion = document.createElement('div')
      liveRegion.id = 'sr-announcements'
      liveRegion.setAttribute('aria-live', 'polite')
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.className = 'sr-only'
      document.body.appendChild(liveRegion)
    }

    // Listen for custom announcement events
    window.addEventListener('portfolio:announce', (event: Event) => {
      this.announceToScreenReader((event as CustomEvent).detail.message)
    })
  }

  /**
   * Announce message to screen readers
   */
  private announceToScreenReader(message: string): void {
    const liveRegion = document.querySelector('#sr-announcements')
    if (liveRegion) {
      liveRegion.textContent = message
      setTimeout(() => {
        liveRegion.textContent = ''
      }, 1000)
    }
  }

  /**
   * Initialize high contrast mode support
   */
  private initializeHighContrastSupport(): void {
    // Detect high contrast mode
    const detectHighContrast = () => {
      const testElement = document.createElement('div')
      testElement.style.cssText =
        'border: 1px solid; border-color: buttontext; position: absolute; top: -999px;'
      document.body.appendChild(testElement)

      const computedStyle = window.getComputedStyle(testElement)
      const isHighContrast = computedStyle.borderTopColor === computedStyle.borderRightColor

      document.body.removeChild(testElement)

      if (isHighContrast) {
        document.documentElement.classList.add('high-contrast')
      }
    }

    detectHighContrast()
  }

  /**
   * Initialize error tracking
   */
  private initializeErrorTracking(): void {
    let errorCount = 0

    // Track JavaScript errors
    if (this.errorTrackingConfig.enableConsoleErrors) {
      window.addEventListener('error', (event) => {
        if (errorCount < this.errorTrackingConfig.maxErrors) {
          this.logError('JavaScript Error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
          })
          errorCount++
        }
      })
    }

    // Track unhandled promise rejections
    if (this.errorTrackingConfig.enableUnhandledRejections) {
      window.addEventListener('unhandledrejection', (event) => {
        if (errorCount < this.errorTrackingConfig.maxErrors) {
          this.logError('Unhandled Promise Rejection', {
            reason: event.reason,
            promise: event.promise,
          })
          errorCount++
        }
      })
    }

    // Track resource loading errors
    if (this.errorTrackingConfig.enableResourceErrors) {
      window.addEventListener(
        'error',
        (event) => {
          const target = event.target as HTMLElement
          if (
            target &&
            target !== (window as unknown as HTMLElement) &&
            errorCount < this.errorTrackingConfig.maxErrors
          ) {
            const elementWithSrc = target as HTMLElementWithSrc
            this.logError('Resource Loading Error', {
              tagName: target.tagName,
              src: elementWithSrc.src || elementWithSrc.href,
              message: 'Failed to load resource',
            })
            errorCount++
          }
        },
        true
      )
    }

    console.log('✅ Error tracking initialized')
  }

  /**
   * Log error with context
   */
  private logError(type: string, details: Record<string, unknown>): void {
    const errorData = {
      type,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    }

    console.error(`[${type}]`, errorData)

    // In production, you might want to send this to an error tracking service
    // Example: Sentry, LogRocket, or custom endpoint
    if (import.meta.env.PROD) {
      // Send to error tracking service
      this.sendErrorToService(errorData)
    }
  }

  /**
   * Send error to tracking service (placeholder)
   */
  private async sendErrorToService(errorData: ErrorData): Promise<void> {
    try {
      // Example implementation - replace with your error tracking service
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData),
      })
    } catch (error) {
      console.warn('Failed to send error to tracking service:', error)
    }
  }

  /**
   * Initialize performance monitoring
   */
  private async initializePerformanceMonitoring(): Promise<void> {
    // Wait for page load
    if (document.readyState === 'loading') {
      await new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', resolve)
      })
    }

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals()

    // Monitor resource loading
    this.monitorResourceLoading()

    // Monitor user interactions
    this.monitorUserInteractions()

    console.log('✅ Performance monitoring initialized')
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    // First Contentful Paint (FCP)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          this.reportMetric('FCP', entry.startTime)
        }
      }
    })
    observer.observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.reportMetric('LCP', lastEntry.startTime)
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEntryWithFID
        this.reportMetric('FID', fidEntry.processingStart - entry.startTime)
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = entry as PerformanceEntryWithCLS
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value
        }
      }
      this.reportMetric('CLS', clsValue)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  }

  /**
   * Monitor resource loading performance
   */
  private monitorResourceLoading(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming

        // Report slow resources
        if (resource.duration > 1000) {
          this.reportMetric('Slow Resource', resource.duration, {
            name: resource.name,
            type: resource.initiatorType,
          })
        }
      }
    })
    observer.observe({ entryTypes: ['resource'] })
  }

  /**
   * Monitor user interactions
   */
  private monitorUserInteractions(): void {
    let interactionCount = 0

    const trackInteraction = (type: string) => {
      interactionCount++
      if (interactionCount <= 10) {
        // Limit tracking
        this.reportMetric('User Interaction', performance.now(), { type })
      }
    }

    document.addEventListener('click', () => trackInteraction('click'))
    document.addEventListener('scroll', () => trackInteraction('scroll'), { passive: true })
    document.addEventListener('keydown', () => trackInteraction('keydown'))
  }

  /**
   * Report performance metric
   */
  private reportMetric(name: string, value: number, context?: Record<string, unknown>): void {
    const metric = {
      name,
      value: Math.round(value),
      context,
      timestamp: Date.now(),
      url: window.location.pathname,
    }

    console.log(`📊 [${name}]`, metric)

    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      this.sendMetricToAnalytics(metric)
    }
  }

  /**
   * Initialize Google Analytics (simple implementation)
   */
  private async initializeAnalytics(): Promise<void> {
    // Only initialize in production or if explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !this.analyticsConfig.trackingId) {
      console.log('📊 Analytics disabled in development mode')
      return
    }

    try {
      // Load Google Analytics 4
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.analyticsConfig.trackingId || 'G-XXXXXXXXXX'}`
      document.head.appendChild(script)

      // Initialize gtag
      // Define proper types for gtag function
      interface GtagFunction {
        (...args: unknown[]): void
        q?: unknown[]
        l?: number
      }

      const windowWithGtag = window as WindowWithGtag & { 
        gtag?: GtagFunction
      }
      
      if (!windowWithGtag.gtag) {
        const gtagFn: GtagFunction = function (...args: unknown[]) {
          gtagFn.q = gtagFn.q || []
          gtagFn.q.push(args)
        }
        windowWithGtag.gtag = gtagFn
      }
      
      if (windowWithGtag.gtag) {
        windowWithGtag.gtag.l = +new Date()
      }

      window.gtag('config', this.analyticsConfig.trackingId || 'G-XXXXXXXXXX', {
        page_title: document.title,
        page_location: window.location.href,
      })

      // Track page views
      if (this.analyticsConfig.enablePageViews) {
        this.trackPageView()
      }

      // Track custom events
      if (this.analyticsConfig.enableEvents) {
        this.initializeEventTracking()
      }

      console.log('✅ Analytics initialized')
    } catch (error) {
      console.warn('Failed to initialize analytics:', error)
    }
  }

  /**
   * Track page view
   */
  private trackPageView(): void {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      })
    }
  }

  /**
   * Initialize event tracking
   */
  private initializeEventTracking(): void {
    // Track project card clicks
    document.addEventListener('click', (event) => {
      const projectCard = (event.target as HTMLElement).closest('[data-project-id]')
      if (projectCard) {
        this.trackEvent('project_view', {
          project_id: projectCard.getAttribute('data-project-id'),
          project_name: projectCard.getAttribute('data-project-name'),
        })
      }
    })

    // Track contact form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      if (form.id === 'contact-form') {
        this.trackEvent('contact_form_submit', {
          form_id: form.id,
        })
      }
    })

    // Track scroll depth
    let maxScrollDepth = 0
    window.addEventListener(
      'scroll',
      () => {
        const scrollDepth = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        )
        if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
          maxScrollDepth = scrollDepth
          this.trackEvent('scroll_depth', {
            depth: scrollDepth,
          })
        }
      },
      { passive: true }
    )
  }

  /**
   * Track custom event
   */
  private trackEvent(eventName: string, parameters: Record<string, unknown> = {}): void {
    if (window.gtag) {
      window.gtag('event', eventName, parameters)
    }
    console.log(`📊 Event: ${eventName}`, parameters)
  }

  /**
   * Send metric to analytics
   */
  private sendMetricToAnalytics(metric: PerformanceMetric): void {
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        custom_parameter: metric.context,
      })
    }
  }

  /**
   * Initialize cross-browser support
   */
  private initializeCrossBrowserSupport(): void {
    // Polyfills for older browsers
    this.loadPolyfills()

    // CSS feature detection
    this.detectCSSFeatures()

    // Browser-specific fixes
    this.applyBrowserFixes()

    console.log('✅ Cross-browser support initialized')
  }

  /**
   * Load necessary polyfills
   */
  private loadPolyfills(): void {
    // Intersection Observer polyfill
    if (!('IntersectionObserver' in window)) {
      const script = document.createElement('script')
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver'
      document.head.appendChild(script)
    }

    // ResizeObserver polyfill
    if (!('ResizeObserver' in window)) {
      const script = document.createElement('script')
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver'
      document.head.appendChild(script)
    }
  }

  /**
   * Detect CSS features and add classes
   */
  private detectCSSFeatures(): void {
    const html = document.documentElement

    // CSS Grid support
    if (CSS.supports('display', 'grid')) {
      html.classList.add('css-grid')
    } else {
      html.classList.add('no-css-grid')
    }

    // CSS Custom Properties support
    if (CSS.supports('color', 'var(--test)')) {
      html.classList.add('css-custom-properties')
    } else {
      html.classList.add('no-css-custom-properties')
    }

    // Backdrop filter support
    if (CSS.supports('backdrop-filter', 'blur(10px)')) {
      html.classList.add('backdrop-filter')
    } else {
      html.classList.add('no-backdrop-filter')
    }
  }

  /**
   * Apply browser-specific fixes
   */
  private applyBrowserFixes(): void {
    const userAgent = navigator.userAgent

    // Safari fixes
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      document.documentElement.classList.add('safari')

      // Fix for Safari's 100vh issue
      const setVH = () => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      }
      setVH()
      window.addEventListener('resize', setVH)
    }

    // iOS fixes
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      document.documentElement.classList.add('ios')
    }

    // Firefox fixes
    if (userAgent.includes('Firefox')) {
      document.documentElement.classList.add('firefox')
    }
  }

  /**
   * Initialize mobile optimizations
   */
  private initializeMobileOptimizations(): void {
    // Touch device detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isTouchDevice) {
      document.documentElement.classList.add('touch-device')

      // Optimize touch interactions
      this.optimizeTouchInteractions()
    } else {
      document.documentElement.classList.add('no-touch')
    }

    // Viewport meta tag optimization
    this.optimizeViewport()

    // Mobile-specific performance optimizations
    this.optimizeMobilePerformance()

    console.log('✅ Mobile optimizations initialized')
  }

  /**
   * Optimize touch interactions
   */
  private optimizeTouchInteractions(): void {
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]')

    interactiveElements.forEach((element) => {
      element.addEventListener(
        'touchstart',
        () => {
          element.classList.add('touch-active')
        },
        { passive: true }
      )

      element.addEventListener(
        'touchend',
        () => {
          setTimeout(() => {
            element.classList.remove('touch-active')
          }, 150)
        },
        { passive: true }
      )
    })

    // Prevent zoom on double tap for specific elements
    const preventZoomElements = document.querySelectorAll('[data-no-zoom]')
    preventZoomElements.forEach((element) => {
      element.addEventListener('touchend', (event) => {
        event.preventDefault()
      })
    })
  }

  /**
   * Optimize viewport settings
   */
  private optimizeViewport(): void {
    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement

    if (!viewportMeta) {
      viewportMeta = document.createElement('meta')
      viewportMeta.name = 'viewport'
      document.head.appendChild(viewportMeta)
    }

    // Set optimal viewport settings
    viewportMeta.content =
      'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
  }

  /**
   * Optimize mobile performance
   */
  private optimizeMobilePerformance(): void {
    // Lazy load images on mobile
    if (window.innerWidth <= 768) {
      const images = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src!
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    }

    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      document.documentElement.classList.add('low-end-device')
    }
  }

  /**
   * Initialize graceful degradation
   */
  private initializeGracefulDegradation(): void {
    // JavaScript disabled fallback
    document.documentElement.classList.remove('no-js')
    document.documentElement.classList.add('js')

    // Network-aware loading
    this.initializeNetworkAwareLoading()

    // Feature detection and fallbacks
    this.initializeFeatureFallbacks()

    console.log('✅ Graceful degradation initialized')
  }

  /**
   * Initialize network-aware loading
   */
  private initializeNetworkAwareLoading(): void {
    const navigatorWithConnection = navigator as NavigatorWithConnection
    if ('connection' in navigatorWithConnection && navigatorWithConnection.connection) {
      const connection = navigatorWithConnection.connection

      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.documentElement.classList.add('slow-connection')

        // Disable non-essential features on slow connections
        this.config.enableAnalytics = false

        // Reduce image quality
        const images = document.querySelectorAll('img')
        images.forEach((img) => {
          if (img.dataset.lowRes) {
            img.src = img.dataset.lowRes
          }
        })
      }
    }
  }

  /**
   * Initialize feature fallbacks
   */
  private initializeFeatureFallbacks(): void {
    // WebP support detection
    const webpSupported =
      document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0

    if (!webpSupported) {
      document.documentElement.classList.add('no-webp')

      // Replace WebP images with fallbacks
      const webpImages = document.querySelectorAll('img[src*=".webp"]')
      webpImages.forEach((img) => {
        const fallbackSrc = (img as HTMLImageElement).src.replace('.webp', '.jpg')
        ;(img as HTMLImageElement).src = fallbackSrc
      })
    }

    // Local storage support
    try {
      localStorage.setItem('test', 'test')
      localStorage.removeItem('test')
    } catch {
      document.documentElement.classList.add('no-localstorage')
    }
  }

  /**
   * Get integration status
   */
  getStatus(): { initialized: boolean; config: IntegrationConfig } {
    return {
      initialized: this.initialized,
      config: this.config,
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<IntegrationConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
}

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Export singleton instance
export const finalIntegration = new FinalIntegration()

// Export the class as default
export default FinalIntegration

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    finalIntegration.initialize()
  })
} else {
  finalIntegration.initialize()
}
