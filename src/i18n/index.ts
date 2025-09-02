import { createI18n } from 'vue-i18n'
import type { SupportedLocale } from '@/types'

// Import translation files
import en from '@/locales/en.json'

// Define available locales
export const SUPPORTED_LOCALES: SupportedLocale[] = ['en']
export const DEFAULT_LOCALE: SupportedLocale = 'en'

// Get user's preferred locale from localStorage or browser
function getInitialLocale(): SupportedLocale {
  const stored = localStorage.getItem('portfolio-locale') as SupportedLocale
  if (stored && SUPPORTED_LOCALES.includes(stored)) {
    return stored
  }

  // Fallback to browser language or default
  const browserLang = navigator.language.split('-')[0] as SupportedLocale
  return SUPPORTED_LOCALES.includes(browserLang) ? browserLang : DEFAULT_LOCALE
}

// Create i18n instance
export const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
  },
  globalInjection: true,
})

// Helper function to change locale
export function setLocale(locale: SupportedLocale) {
  if (SUPPORTED_LOCALES.includes(locale)) {
    i18n.global.locale.value = locale
    localStorage.setItem('portfolio-locale', locale)
    document.documentElement.lang = locale
  }
}

// Initialize document language
document.documentElement.lang = getInitialLocale()
