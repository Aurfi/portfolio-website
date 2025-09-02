import { ref, nextTick } from 'vue'

// Screen reader announcement management
const announcements = ref<string[]>([])

export function useAccessibility() {
  /**
   * Announce a message to screen readers
   * @param message - The message to announce
   * @param priority - The priority level (polite or assertive)
   */
  const announce = async (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    // Add to announcements array
    announcements.value.push(message)

    // Create or update the live region
    let liveRegion = document.getElementById(`live-region-${priority}`)

    if (!liveRegion) {
      liveRegion = document.createElement('div')
      liveRegion.id = `live-region-${priority}`
      liveRegion.setAttribute('aria-live', priority)
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.className = 'sr-only'
      document.body.appendChild(liveRegion)
    }

    // Clear and set the message
    liveRegion.textContent = ''
    await nextTick()
    liveRegion.textContent = message

    // Clean up after announcement
    setTimeout(() => {
      const index = announcements.value.indexOf(message)
      if (index > -1) {
        announcements.value.splice(index, 1)
      }
      if (liveRegion && announcements.value.length === 0) {
        liveRegion.textContent = ''
      }
    }, 1000)
  }

  /**
   * Focus an element and scroll it into view
   * @param selector - CSS selector or element
   * @param options - Scroll options
   */
  const focusElement = (
    selector: string | HTMLElement,
    options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center' }
  ) => {
    const element =
      typeof selector === 'string' ? (document.querySelector(selector) as HTMLElement) : selector

    if (element) {
      element.focus()
      element.scrollIntoView(options)
    }
  }

  /**
   * Trap focus within a container (useful for modals)
   * @param container - The container element
   * @returns Function to remove the trap
   */
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)

    // Focus the first element
    if (firstElement) {
      firstElement.focus()
    }

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }

  /**
   * Check if user prefers reduced motion
   */
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Get appropriate animation duration based on user preference
   * @param normalDuration - Normal animation duration in ms
   * @param reducedDuration - Reduced animation duration in ms
   */
  const getAnimationDuration = (normalDuration: number, reducedDuration: number = 0) => {
    return prefersReducedMotion() ? reducedDuration : normalDuration
  }

  /**
   * Add screen reader only text
   * @param text - Text for screen readers
   * @returns Element with screen reader only text
   */
  const createSROnlyText = (text: string) => {
    const span = document.createElement('span')
    span.className = 'sr-only'
    span.textContent = text
    return span
  }

  /**
   * Manage page title for screen readers and SEO
   * @param title - The page title
   * @param siteName - The site name (optional)
   */
  const setPageTitle = (title: string, siteName: string = 'Portfolio') => {
    document.title = `${title} | ${siteName}`

    // Also announce page change to screen readers
    announce(`Navigated to ${title}`, 'polite')
  }

  return {
    announce,
    focusElement,
    trapFocus,
    prefersReducedMotion,
    getAnimationDuration,
    createSROnlyText,
    setPageTitle,
    announcements: announcements.value,
  }
}

// Global styles for screen reader only content
export const injectAccessibilityStyles = () => {
  if (document.getElementById('accessibility-styles')) return

  const style = document.createElement('style')
  style.id = 'accessibility-styles'
  style.textContent = `
    .sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
    
    .sr-only:focus {
      position: static !important;
      width: auto !important;
      height: auto !important;
      padding: inherit !important;
      margin: inherit !important;
      overflow: visible !important;
      clip: auto !important;
      white-space: inherit !important;
    }
    
    /* Focus indicators */
    *:focus {
      outline: 2px solid var(--color-primary, #007bff) !important;
      outline-offset: 2px !important;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      * {
        border-color: ButtonText !important;
      }
      
      button, input, select, textarea {
        border: 2px solid ButtonText !important;
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `

  document.head.appendChild(style)
}
