import { computed } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'
import { setLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/i18n'
import type { SupportedLocale } from '@/types'

/**
 * Composable for managing internationalization
 * Provides translation functions and locale management
 */
export function useI18n() {
  const { t, locale, availableLocales } = useVueI18n()

  // Current locale as computed property
  const currentLocale = computed(() => locale.value as SupportedLocale)

  // Available locales for the application
  const supportedLocales = computed(() => SUPPORTED_LOCALES)

  // Check if a locale is supported
  const isLocaleSupported = (localeCode: string): localeCode is SupportedLocale => {
    return SUPPORTED_LOCALES.includes(localeCode as SupportedLocale)
  }

  // Change the current locale
  const changeLocale = (newLocale: SupportedLocale) => {
    if (isLocaleSupported(newLocale)) {
      setLocale(newLocale)
    } else {
      console.warn(`Locale ${newLocale} is not supported. Falling back to ${DEFAULT_LOCALE}`)
      setLocale(DEFAULT_LOCALE)
    }
  }

  // Get locale display name
  const getLocaleDisplayName = (localeCode: SupportedLocale): string => {
    const displayNames: Record<SupportedLocale, string> = {
      en: 'English',
    }
    return displayNames[localeCode] || localeCode
  }

  // Get locale native name (how the language is written in its own script)
  const getLocaleNativeName = (localeCode: SupportedLocale): string => {
    const nativeNames: Record<SupportedLocale, string> = {
      en: 'English',
    }
    return nativeNames[localeCode] || localeCode
  }

  // Translation function with type safety
  const translate = (key: string, values?: Record<string, unknown>) => {
    return values ? t(key, values) : t(key)
  }

  // Check if translation key exists
  const hasTranslation = (key: string): boolean => {
    return t(key) !== key
  }

  // Get translation with fallback
  const translateWithFallback = (
    key: string,
    fallback: string,
    values?: Record<string, unknown>
  ) => {
    const translation = values ? t(key, values) : t(key)
    return translation !== key ? translation : fallback
  }

  return {
    // Translation functions
    t: translate,
    translate,
    hasTranslation,
    translateWithFallback,

    // Locale management
    currentLocale,
    supportedLocales,
    availableLocales,
    changeLocale,
    isLocaleSupported,

    // Locale display
    getLocaleDisplayName,
    getLocaleNativeName,

    // Constants
    defaultLocale: DEFAULT_LOCALE,
  }
}
