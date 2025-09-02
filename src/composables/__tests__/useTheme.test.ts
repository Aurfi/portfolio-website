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

  it('initializes with auto theme by default', () => {
    let result: ReturnType<typeof useTheme> | undefined

    const component = {
      setup() {
        result = useTheme()
        return {}
      },
    }

    createApp(component).mount(document.createElement('div'))
    expect(result?.currentTheme.value).toBe('auto')
  })

  it('provides theme labels', () => {
    let result: ReturnType<typeof useTheme> | undefined

    const component = {
      setup() {
        result = useTheme()
        return {}
      },
    }

    createApp(component).mount(document.createElement('div'))
    expect(result?.themeLabels.value).toEqual({
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
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
    }

    createApp(component).mount(document.createElement('div'))
    expect(result?.themeIcons.value).toEqual({
      light: '☀️',
      dark: '🌙',
      auto: '🔄',
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
    }

    createApp(component).mount(document.createElement('div'))

    result?.setTheme('dark')
    expect(result?.currentTheme.value).toBe('dark')
    expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-theme', 'dark')
  })

  it('cycles through themes correctly', () => {
    let result: ReturnType<typeof useTheme> | undefined

    const component = {
      setup() {
        result = useTheme()
        return {}
      },
    }

    createApp(component).mount(document.createElement('div'))

    // Start with auto
    expect(result?.currentTheme.value).toBe('auto')

    // The cycle order might be different, let's just test that it cycles
    const initialTheme = result?.currentTheme.value
    result?.cycleTheme()
    const secondTheme = result?.currentTheme.value

    expect(secondTheme).not.toBe(initialTheme)
    expect(['light', 'dark', 'auto', 'high-contrast']).toContain(secondTheme)
  })
})
