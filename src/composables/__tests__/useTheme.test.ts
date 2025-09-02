import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp } from 'vue'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    // Reset localStorage and DOM before each test
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')

    // Mock localStorage properly
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
  })

  it('initializes with default theme by default', () => {
    let result: ReturnType<typeof useTheme> | undefined

    const component = {
      setup() {
        result = useTheme()
        return {}
      },
      template: '<div></div>'
    }

    createApp(component).mount(document.createElement('div'))
    expect(result?.currentTheme.value).toBe('default')
  })

  it('provides theme labels', () => {
    let result: ReturnType<typeof useTheme> | undefined

    const component = {
      setup() {
        result = useTheme()
        return {}
      },
      template: '<div></div>'
    }

    createApp(component).mount(document.createElement('div'))
    expect(result?.themeLabels.value).toEqual({
      'default': 'Default',
      'high-contrast': 'High Contrast',
    })
  })

  it('provides theme icons', () => {
    let result: ReturnType<typeof useTheme> | undefined

    const component = {
      setup() {
        result = useTheme()
        return {}
      },
      template: '<div></div>'
    }

    createApp(component).mount(document.createElement('div'))
    expect(result?.themeIcons.value).toEqual({
      'default': '🎨',
      'high-contrast': '⚡',
    })
  })

  it('sets theme correctly', () => {
    let result: ReturnType<typeof useTheme> | undefined

    const component = {
      setup() {
        result = useTheme()
        return {}
      },
      template: '<div></div>'
    }

    createApp(component).mount(document.createElement('div'))

    result?.setTheme('high-contrast')
    expect(result?.currentTheme.value).toBe('high-contrast')
    expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'high-contrast')
  })

  it('cycles through themes correctly', () => {
    let result: ReturnType<typeof useTheme> | undefined

    const component = {
      setup() {
        result = useTheme()
        return {}
      },
      template: '<div></div>'
    }

    createApp(component).mount(document.createElement('div'))

    // Start with default
    expect(result?.currentTheme.value).toBe('default')

    // Toggle to high-contrast
    result?.toggleTheme()
    expect(result?.currentTheme.value).toBe('high-contrast')

    // Toggle back to default
    result?.toggleTheme()
    expect(result?.currentTheme.value).toBe('default')
  })
})
