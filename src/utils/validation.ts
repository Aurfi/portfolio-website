/**
 * Runtime type validation utilities for critical data flows
 */

export interface ValidationResult {
  valid: boolean
  errors?: string[]
}

export interface TypeGuard<T> {
  (value: unknown): value is T
}

// Basic type guards
export const isString: TypeGuard<string> = (value): value is string => {
  return typeof value === 'string'
}

export const isNumber: TypeGuard<number> = (value): value is number => {
  return typeof value === 'number' && !isNaN(value)
}

export const isBoolean: TypeGuard<boolean> = (value): value is boolean => {
  return typeof value === 'boolean'
}

export const isArray: TypeGuard<unknown[]> = (value): value is unknown[] => {
  return Array.isArray(value)
}

export const isObject: TypeGuard<Record<string, unknown>> = (
  value
): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export const isNull: TypeGuard<null> = (value): value is null => {
  return value === null
}

export const isUndefined: TypeGuard<undefined> = (value): value is undefined => {
  return value === undefined
}

export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown => {
  return typeof value === 'function'
}

// Complex type guards
export const isEmail: TypeGuard<string> = (value): value is string => {
  if (!isString(value)) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export const isUrl: TypeGuard<string> = (value): value is string => {
  if (!isString(value)) return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const isDate: TypeGuard<Date> = (value): value is Date => {
  return value instanceof Date && !isNaN(value.getTime())
}

export const isUUID: TypeGuard<string> = (value): value is string => {
  if (!isString(value)) return false
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

// Form validation
export interface FormField {
  value: unknown
  required?: boolean
  type?: 'string' | 'number' | 'email' | 'url' | 'date'
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: unknown) => boolean | string
}

export interface FormSchema {
  [key: string]: FormField
}

export function validateForm(schema: FormSchema): ValidationResult {
  const errors: string[] = []

  for (const [fieldName, field] of Object.entries(schema)) {
    const { value, required, type, min, max, pattern, custom } = field

    // Required validation
    if (required && (isNull(value) || isUndefined(value) || value === '')) {
      errors.push(`${fieldName} is required`)
      continue
    }

    // Skip validation if field is optional and empty
    if (!required && (isNull(value) || isUndefined(value) || value === '')) {
      continue
    }

    // Type validation
    switch (type) {
      case 'string':
        if (!isString(value)) {
          errors.push(`${fieldName} must be a string`)
        } else {
          if (min !== undefined && value.length < min) {
            errors.push(`${fieldName} must be at least ${min} characters`)
          }
          if (max !== undefined && value.length > max) {
            errors.push(`${fieldName} must be at most ${max} characters`)
          }
          if (pattern && !pattern.test(value)) {
            errors.push(`${fieldName} format is invalid`)
          }
        }
        break

      case 'number':
        if (!isNumber(value)) {
          errors.push(`${fieldName} must be a number`)
        } else {
          if (min !== undefined && value < min) {
            errors.push(`${fieldName} must be at least ${min}`)
          }
          if (max !== undefined && value > max) {
            errors.push(`${fieldName} must be at most ${max}`)
          }
        }
        break

      case 'email':
        if (!isEmail(value)) {
          errors.push(`${fieldName} must be a valid email address`)
        }
        break

      case 'url':
        if (!isUrl(value)) {
          errors.push(`${fieldName} must be a valid URL`)
        }
        break

      case 'date':
        if (!isDate(value)) {
          errors.push(`${fieldName} must be a valid date`)
        }
        break
    }

    // Custom validation
    if (custom) {
      const result = custom(value)
      if (typeof result === 'string') {
        errors.push(result)
      } else if (!result) {
        errors.push(`${fieldName} validation failed`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// API response validation
export interface ApiResponseSchema {
  status?: 'success' | 'error'
  data?: unknown
  message?: string
  errors?: string[]
}

export function validateApiResponse(response: unknown): response is ApiResponseSchema {
  if (!isObject(response)) return false

  const res = response as Record<string, unknown>

  // Check status if present
  if ('status' in res && res.status !== 'success' && res.status !== 'error') {
    return false
  }

  // Check message if present
  if ('message' in res && !isString(res.message)) {
    return false
  }

  // Check errors if present
  if ('errors' in res && !isArray(res.errors)) {
    return false
  }

  return true
}

// LocalStorage validation
export function validateLocalStorageData<T>(key: string, validator: TypeGuard<T>): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    const data = JSON.parse(raw)
    if (validator(data)) {
      return data
    }

    console.warn(`Invalid data in localStorage for key: ${key}`)
    return null
  } catch (error) {
    console.error(`Failed to parse localStorage data for key: ${key}`, error)
    return null
  }
}

// Configuration validation
export interface AppConfig {
  apiUrl?: string
  version?: string
  features?: {
    analytics?: boolean
    pwa?: boolean
    i18n?: boolean
  }
  theme?: {
    default?: 'light' | 'dark' | 'auto'
    allowUserSelection?: boolean
  }
}

export function validateAppConfig(config: unknown): config is AppConfig {
  if (!isObject(config)) return false

  const cfg = config as Record<string, unknown>

  // Validate apiUrl
  if ('apiUrl' in cfg && !isString(cfg.apiUrl)) {
    return false
  }

  // Validate version
  if ('version' in cfg && !isString(cfg.version)) {
    return false
  }

  // Validate features
  if ('features' in cfg) {
    if (!isObject(cfg.features)) return false
    const features = cfg.features as Record<string, unknown>

    if ('analytics' in features && !isBoolean(features.analytics)) return false
    if ('pwa' in features && !isBoolean(features.pwa)) return false
    if ('i18n' in features && !isBoolean(features.i18n)) return false
  }

  // Validate theme
  if ('theme' in cfg) {
    if (!isObject(cfg.theme)) return false
    const theme = cfg.theme as Record<string, unknown>

    if ('default' in theme) {
      const validThemes = ['light', 'dark', 'auto']
      if (!validThemes.includes(theme.default as string)) return false
    }

    if ('allowUserSelection' in theme && !isBoolean(theme.allowUserSelection)) {
      return false
    }
  }

  return true
}

// Create a type-safe validator factory
export function createValidator<T>(
  schema: Record<keyof T, (value: unknown) => boolean>
): TypeGuard<T> {
  return (value: unknown): value is T => {
    if (!isObject(value)) return false

    const obj = value as Record<string, unknown>

    for (const [key, validatorFn] of Object.entries(schema)) {
      const validator = validatorFn as (value: unknown) => boolean
      if (!(key in obj) || !validator(obj[key])) {
        return false
      }
    }

    return true
  }
}

// Example usage: Contact form validation
export interface ContactFormData {
  name: string
  email: string
  message: string
  phone?: string
}

export const validateContactForm = (data: unknown): ValidationResult => {
  const formData = data as Record<string, unknown>
  const schema: FormSchema = {
    name: {
      value: formData?.name,
      required: true,
      type: 'string',
      min: 2,
      max: 100,
    },
    email: {
      value: formData?.email,
      required: true,
      type: 'email',
    },
    message: {
      value: formData?.message,
      required: true,
      type: 'string',
      min: 10,
      max: 1000,
    },
    phone: {
      value: formData?.phone,
      required: false,
      type: 'string',
      pattern: /^[\d\s\-+()]+$/,
      custom: (value) => {
        if (!value) return true
        const cleaned = String(value).replace(/\D/g, '')
        return cleaned.length >= 10 ? true : 'Phone number must be at least 10 digits'
      },
    },
  }

  return validateForm(schema)
}
