import { ref, computed, watch, onMounted } from 'vue'

// Simplified theme type - easy to extend in the future
export type Theme = 'default' | 'high-contrast'

const THEME_STORAGE_KEY = 'portfolio-theme'

export function useTheme() {
  const currentTheme = ref<Theme>('default')

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    // Remove all theme attributes
    document.documentElement.removeAttribute('data-theme')

    // Apply new theme if not default
    if (theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }

  // Set theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    applyTheme(theme)
  }

  // Toggle between default and high-contrast
  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'high-contrast' ? 'default' : 'high-contrast'
    setTheme(newTheme)
  }

  // Initialize theme from localStorage
  const initializeTheme = () => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    if (savedTheme && ['default', 'high-contrast'].includes(savedTheme)) {
      currentTheme.value = savedTheme
    }

    // Apply initial theme
    applyTheme(currentTheme.value)
  }

  // Watch for theme changes
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  // Theme labels for UI
  const themeLabels = computed(() => ({
    'default': 'Default',
    'high-contrast': 'High Contrast',
  }))

  // Theme icons for UI
  const themeIcons = computed(() => ({
    'default': '🎨',
    'high-contrast': '⚡',
  }))

  // Available themes for future extension
  const availableThemes = computed<Theme[]>(() => ['default', 'high-contrast'])

  // Initialize on mount
  onMounted(() => {
    initializeTheme()
  })

  return {
    currentTheme: readonly(currentTheme),
    availableThemes,
    setTheme,
    toggleTheme,
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
