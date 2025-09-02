// Global type declarations

declare global {
  // Google Analytics gtag function
  function gtag(...args: unknown[]): void

  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }

  interface Navigator {
    connection?: {
      effectiveType?: string
      downlink?: number
    }
    mozConnection?: {
      effectiveType?: string
      downlink?: number
    }
    webkitConnection?: {
      effectiveType?: string
      downlink?: number
    }
  }
}

export {}
