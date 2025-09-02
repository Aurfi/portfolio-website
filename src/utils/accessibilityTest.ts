/**
 * Accessibility testing utilities
 * These functions help verify accessibility compliance during development
 */

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  element: Element
  message: string
  rule: string
}

/**
 * Check for proper heading hierarchy
 */
export function checkHeadingHierarchy(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')

  let previousLevel = 0

  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1))

    // Check for h1 presence
    if (index === 0 && level !== 1) {
      issues.push({
        type: 'error',
        element: heading,
        message: 'Page should start with an h1 element',
        rule: 'heading-hierarchy',
      })
    }

    // Check for skipped levels
    if (level > previousLevel + 1) {
      issues.push({
        type: 'warning',
        element: heading,
        message: `Heading level skipped from h${previousLevel} to h${level}`,
        rule: 'heading-hierarchy',
      })
    }

    previousLevel = level
  })

  return issues
}

/**
 * Check for missing alt text on images
 */
export function checkImageAltText(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  const images = document.querySelectorAll('img')

  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'error',
        element: img,
        message: 'Image missing alt attribute',
        rule: 'img-alt',
      })
    } else if (img.alt === '' && !img.hasAttribute('aria-hidden')) {
      issues.push({
        type: 'warning',
        element: img,
        message: 'Image has empty alt text but is not marked as decorative',
        rule: 'img-alt',
      })
    }
  })

  return issues
}

/**
 * Check for proper form labels
 */
export function checkFormLabels(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  const formControls = document.querySelectorAll('input, select, textarea')

  formControls.forEach((control) => {
    const id = control.id
    const ariaLabel = control.getAttribute('aria-label')
    const ariaLabelledBy = control.getAttribute('aria-labelledby')
    const label = id ? document.querySelector(`label[for="${id}"]`) : null

    if (!label && !ariaLabel && !ariaLabelledBy) {
      issues.push({
        type: 'error',
        element: control,
        message: 'Form control missing accessible label',
        rule: 'form-labels',
      })
    }
  })

  return issues
}

/**
 * Check for proper focus indicators
 */
export function checkFocusIndicators(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  focusableElements.forEach((element) => {
    const styles = window.getComputedStyle(element, ':focus')
    const outline = styles.outline
    const boxShadow = styles.boxShadow

    if (outline === 'none' && boxShadow === 'none') {
      issues.push({
        type: 'warning',
        element: element,
        message: 'Element may not have visible focus indicator',
        rule: 'focus-indicators',
      })
    }
  })

  return issues
}

/**
 * Check for proper ARIA usage
 */
export function checkAriaUsage(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // Check for aria-hidden on focusable elements
  const ariaHiddenElements = document.querySelectorAll('[aria-hidden="true"]')
  ariaHiddenElements.forEach((element) => {
    const focusableChild = element.querySelector(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableChild) {
      issues.push({
        type: 'error',
        element: element,
        message: 'aria-hidden element contains focusable content',
        rule: 'aria-hidden-focus',
      })
    }
  })

  // Check for proper button roles
  const buttons = document.querySelectorAll('[role="button"]')
  buttons.forEach((button) => {
    if (!button.hasAttribute('tabindex')) {
      issues.push({
        type: 'warning',
        element: button,
        message: 'Element with button role should be keyboard accessible',
        rule: 'button-keyboard',
      })
    }
  })

  return issues
}

/**
 * Check color contrast (basic check)
 */
export function checkColorContrast(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // This is a simplified check - in production, use a proper contrast checking library
  const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6')

  textElements.forEach((element) => {
    const styles = window.getComputedStyle(element)
    const color = styles.color
    const backgroundColor = styles.backgroundColor

    // Skip if transparent background
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      return
    }

    // This is a very basic check - real implementation would calculate actual contrast ratio
    if (color === backgroundColor) {
      issues.push({
        type: 'error',
        element: element,
        message: 'Text color same as background color',
        rule: 'color-contrast',
      })
    }
  })

  return issues
}

/**
 * Check for keyboard navigation issues
 */
export function checkKeyboardNavigation(): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []

  // Check for skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]')
  let hasSkipToMain = false

  skipLinks.forEach((link) => {
    if (link.textContent?.toLowerCase().includes('skip to main')) {
      hasSkipToMain = true
    }
  })

  if (!hasSkipToMain) {
    issues.push({
      type: 'warning',
      element: document.body,
      message: 'Page should include skip to main content link',
      rule: 'skip-links',
    })
  }

  // Check for proper tabindex usage
  const tabindexElements = document.querySelectorAll('[tabindex]')
  tabindexElements.forEach((element) => {
    const tabindex = parseInt(element.getAttribute('tabindex') || '0')

    if (tabindex > 0) {
      issues.push({
        type: 'warning',
        element: element,
        message: 'Positive tabindex values can disrupt natural tab order',
        rule: 'tabindex-positive',
      })
    }
  })

  return issues
}

/**
 * Run all accessibility checks
 */
export function runAccessibilityAudit(): {
  issues: AccessibilityIssue[]
  summary: { errors: number; warnings: number; info: number }
} {
  const allIssues: AccessibilityIssue[] = [
    ...checkHeadingHierarchy(),
    ...checkImageAltText(),
    ...checkFormLabels(),
    ...checkFocusIndicators(),
    ...checkAriaUsage(),
    ...checkColorContrast(),
    ...checkKeyboardNavigation(),
  ]

  const summary = {
    errors: allIssues.filter((issue) => issue.type === 'error').length,
    warnings: allIssues.filter((issue) => issue.type === 'warning').length,
    info: allIssues.filter((issue) => issue.type === 'info').length,
  }

  return { issues: allIssues, summary }
}

/**
 * Log accessibility issues to console (development only)
 */
export function logAccessibilityIssues(): void {
  if (import.meta.env.MODE !== 'development') return

  const { issues, summary } = runAccessibilityAudit()

  if (issues.length === 0) {
    console.log('✅ No accessibility issues found!')
    return
  }

  console.group('🔍 Accessibility Audit Results')
  console.log(
    `Found ${issues.length} issues: ${summary.errors} errors, ${summary.warnings} warnings, ${summary.info} info`
  )

  issues.forEach((issue) => {
    const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'
    console.log(`${icon} [${issue.rule}] ${issue.message}`, issue.element)
  })

  console.groupEnd()
}
