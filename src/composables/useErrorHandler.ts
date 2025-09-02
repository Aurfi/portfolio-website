import { ref, computed, type ComputedRef } from 'vue'
import { useRouter } from 'vue-router'

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}

export interface ErrorContext {
  id: string
  timestamp: Date
  message: string
  severity: ErrorSeverity
  category: ErrorCategory
  stack?: string
  url?: string
  userAgent?: string
  additional?: Record<string, unknown>
  retryable?: boolean
  retryCount?: number
}

export interface ErrorHandler {
  handle: (error: Error | ErrorContext, context?: Partial<ErrorContext>) => void
  clear: () => void
  clearError: (id: string) => void
  retry: (id: string) => Promise<void>
  log: (error: ErrorContext) => void
  errors: ComputedRef<ErrorContext[]>
  hasErrors: ComputedRef<boolean>
  criticalErrors: ComputedRef<ErrorContext[]>
}

const errors = ref<ErrorContext[]>([])
const retryCallbacks = new Map<string, () => Promise<void>>()

export function useErrorHandler(): ErrorHandler {
  const router = useRouter()

  const hasErrors = computed(() => errors.value.length > 0)
  const criticalErrors = computed(() => 
    errors.value.filter(e => e.severity === ErrorSeverity.CRITICAL)
  )

  const generateErrorId = (): string => {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const categorizeError = (error: Error): ErrorCategory => {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorCategory.NETWORK
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorCategory.VALIDATION
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return ErrorCategory.AUTHENTICATION
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return ErrorCategory.PERMISSION
    }
    if (message.includes('not found') || message.includes('404')) {
      return ErrorCategory.NOT_FOUND
    }
    if (message.includes('server') || message.includes('500')) {
      return ErrorCategory.SERVER
    }
    
    return ErrorCategory.UNKNOWN
  }

  const determineSeverity = (category: ErrorCategory): ErrorSeverity => {
    switch (category) {
      case ErrorCategory.NETWORK:
        return ErrorSeverity.MEDIUM
      case ErrorCategory.VALIDATION:
        return ErrorSeverity.LOW
      case ErrorCategory.AUTHENTICATION:
      case ErrorCategory.PERMISSION:
        return ErrorSeverity.HIGH
      case ErrorCategory.NOT_FOUND:
        return ErrorSeverity.LOW
      case ErrorCategory.SERVER:
        return ErrorSeverity.CRITICAL
      default:
        return ErrorSeverity.MEDIUM
    }
  }

  const handle = (error: Error | ErrorContext, context?: Partial<ErrorContext>) => {
    let errorContext: ErrorContext

    if (error instanceof Error) {
      const category = categorizeError(error)
      errorContext = {
        id: generateErrorId(),
        timestamp: new Date(),
        message: error.message,
        severity: determineSeverity(category),
        category,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        retryable: category === ErrorCategory.NETWORK,
        retryCount: 0,
        ...context
      }
    } else {
      errorContext = {
        ...error,
        id: error.id || generateErrorId(),
        timestamp: error.timestamp || new Date(),
        ...context
      }
    }

    // Add to errors list
    errors.value.push(errorContext)

    // Log the error
    log(errorContext)

    // Handle critical errors
    if (errorContext.severity === ErrorSeverity.CRITICAL) {
      handleCriticalError(errorContext)
    }

    // Auto-clear low severity errors after 5 seconds
    if (errorContext.severity === ErrorSeverity.LOW) {
      setTimeout(() => {
        clearError(errorContext.id)
      }, 5000)
    }
  }

  const handleCriticalError = (error: ErrorContext) => {
    // Log to external service (if configured)
    if (import.meta.env.PROD) {
      // Send to error tracking service
      console.error('Critical error:', error)
    }

    // Redirect to error page for certain critical errors
    if (error.category === ErrorCategory.SERVER) {
      router.push('/error/500')
    }
  }

  const clear = () => {
    errors.value = []
    retryCallbacks.clear()
  }

  const clearError = (id: string) => {
    const index = errors.value.findIndex(e => e.id === id)
    if (index !== -1) {
      errors.value.splice(index, 1)
      retryCallbacks.delete(id)
    }
  }

  const retry = async (id: string): Promise<void> => {
    const error = errors.value.find(e => e.id === id)
    if (!error || !error.retryable) return

    const callback = retryCallbacks.get(id)
    if (callback) {
      try {
        // Increment retry count
        error.retryCount = (error.retryCount || 0) + 1
        
        // Attempt retry
        await callback()
        
        // Success - clear the error
        clearError(id)
      } catch (retryError) {
        // Update error with new failure
        error.timestamp = new Date()
        
        // Disable retry after 3 attempts
        if ((error.retryCount || 0) >= 3) {
          error.retryable = false
          error.severity = ErrorSeverity.HIGH
        }
      }
    }
  }

  const log = (error: ErrorContext) => {
    const logLevel = error.severity === ErrorSeverity.CRITICAL ? 'error' : 
                     error.severity === ErrorSeverity.HIGH ? 'warn' : 'info'
    
    console[logLevel](`[${error.category.toUpperCase()}] ${error.message}`, {
      id: error.id,
      severity: error.severity,
      timestamp: error.timestamp,
      additional: error.additional
    })

    // In development, also log the stack trace
    if (import.meta.env.DEV && error.stack) {
      console.debug('Stack trace:', error.stack)
    }
  }


  return {
    handle,
    clear,
    clearError,
    retry,
    log,
    errors: computed(() => errors.value),
    hasErrors,
    criticalErrors
  }
}

// Global error handler
export function setupGlobalErrorHandler() {
  const { handle } = useErrorHandler()

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handle(new Error(event.reason), {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.HIGH,
      additional: { reason: event.reason }
    })
    event.preventDefault()
  })

  // Handle global errors
  window.addEventListener('error', (event) => {
    handle(new Error(event.message), {
      category: ErrorCategory.CLIENT,
      severity: ErrorSeverity.HIGH,
      additional: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    })
    event.preventDefault()
  })
}