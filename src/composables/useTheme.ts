import { ref, computed, watch, onMounted } from 'vue'

export type Theme = 'light' | 'dark' | 'auto' | 'high-contrast'

const THEME_STORAGE_KEY = 'portfolio-theme'

export function useTheme() {
  const currentTheme = ref<Theme>('auto')
  const systemPrefersDark = ref(false)

  // Computed actual theme (resolves 'auto' to light/dark)
  const resolvedTheme = computed(() => {
    if (currentTheme.value === 'auto') {
      return systemPrefersDark.value ? 'dark' : 'light'
    }
    return currentTheme.value
  })

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    const resolvedValue = theme === 'auto' ? (systemPrefersDark.value ? 'dark' : 'light') : theme

    // Remove all theme attributes
    document.documentElement.removeAttribute('data-theme')

    // Apply new theme if not light (light is default)
    if (resolvedValue !== 'light') {
      document.documentElement.setAttribute('data-theme', resolvedValue)
    }

    // Update meta theme-color for mobile browsers
    updateMetaThemeColor(resolvedValue)
  }

  // Update meta theme-color for mobile browsers
  const updateMetaThemeColor = (theme: string) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    const color = theme === 'dark' ? '#111827' : '#ffffff'

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', color)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = color
      document.head.appendChild(meta)
    }
  }

  // Set theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyTheme(theme)
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Cycle through all themes
  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto', 'high-contrast']
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    if (savedTheme && ['light', 'dark', 'auto', 'high-contrast'].includes(savedTheme)) {
      currentTheme.value = savedTheme
    }

    // Set up system preference detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = mediaQuery.matches

    // Listen for system preference changes
    mediaQuery.addEventListener('change', (e) => {
      systemPrefersDark.value = e.matches
      if (currentTheme.value === 'auto') {
        applyTheme('auto')
      }
    })

    // Apply initial theme
    applyTheme(currentTheme.value)
  }

  // Watch for theme changes
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  // Theme labels for UI
  const themeLabels = computed(() => ({
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
    'high-contrast': 'High Contrast',
  }))

  // Theme icons for UI
  const themeIcons = computed(() => ({
    light: '☀️',
    dark: '🌙',
    auto: '🔄',
    'high-contrast': '⚡',
  }))

  // Initialize on mount
  onMounted(() => {
    initializeTheme()
  })

  return {
    currentTheme: readonly(currentTheme),
    resolvedTheme,
    systemPrefersDark: readonly(systemPrefersDark),
    setTheme,
    toggleTheme,
    cycleTheme,
    themeLabels,
    themeIcons,
    initializeTheme,
  }
}

import type { Ref } from 'vue'

// Helper function to make refs readonly
function readonly<T>(ref: Ref<T>) {
  return computed(() => ref.value)
}
