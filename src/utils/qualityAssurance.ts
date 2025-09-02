interface QualityCheck {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  element?: Element
}

interface QualityReport {
  score: number
  checks: QualityCheck[]
  summary: {
    passed: number
    failed: number
    warnings: number
  }
}

export class QualityAssurance {
  private checks: QualityCheck[] = []

  async runAllChecks(): Promise<QualityReport> {
    this.checks = []

    // Run all quality checks
    this.checkAccessibility()
    this.checkPerformance()
    this.checkSEO()
    this.checkResponsiveDesign()
    this.checkBrowserCompatibility()
    this.checkContentQuality()
    this.checkNavigation()
    this.checkForms()
    this.checkImages()
    this.checkLinks()

    return this.generateReport()
  }

  private checkAccessibility(): void {
    // Check for proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let hasH1 = false
    let previousLevel = 0

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))

      if (index === 0 && level !== 1) {
        this.addCheck('accessibility', 'fail', 'Page should start with h1', heading)
      }

      if (level === 1) {
        if (hasH1) {
          this.addCheck('accessibility', 'warning', 'Multiple h1 elements found', heading)
        }
        hasH1 = true
      }

      if (level > previousLevel + 1) {
        this.addCheck(
          'accessibility',
          'fail',
          `Heading level skipped from h${previousLevel} to h${level}`,
          heading
        )
      }

      previousLevel = level
    })

    // Check for alt attributes on images
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.hasAttribute('alt')) {
        this.addCheck('accessibility', 'fail', 'Image missing alt attribute', img)
      } else if (img.alt.trim() === '') {
        this.addCheck('accessibility', 'warning', 'Image has empty alt attribute', img)
      }
    })

    // Check for form labels
    const inputs = document.querySelectorAll('input, textarea, select')
    inputs.forEach((input) => {
      const id = input.id
      const label = id ? document.querySelector(`label[for="${id}"]`) : null
      const ariaLabel = input.getAttribute('aria-label')
      const ariaLabelledBy = input.getAttribute('aria-labelledby')

      if (!label && !ariaLabel && !ariaLabelledBy) {
        this.addCheck('accessibility', 'fail', 'Form control missing accessible label', input)
      }
    })

    // Check for focus indicators
    let hasFocusStyles = false

    // Check if CSS has focus styles
    const stylesheets = Array.from(document.styleSheets)
    stylesheets.forEach((stylesheet) => {
      try {
        const rules = Array.from(stylesheet.cssRules || [])
        rules.forEach((rule) => {
          if (rule instanceof CSSStyleRule && rule.selectorText?.includes(':focus')) {
            hasFocusStyles = true
          }
        })
      } catch {
        // Cross-origin stylesheet, skip
      }
    })

    if (!hasFocusStyles) {
      this.addCheck('accessibility', 'warning', 'No focus styles detected in CSS')
    }

    // Check color contrast (basic check)
    this.checkColorContrast()
  }

  private checkColorContrast(): void {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button')

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element)
      const color = styles.color
      const backgroundColor = styles.backgroundColor

      // Basic check - if colors are the same, it's definitely a problem
      if (color === backgroundColor && color !== 'rgba(0, 0, 0, 0)') {
        this.addCheck('accessibility', 'fail', 'Text color same as background color', element)
      }
    })
  }

  private checkPerformance(): void {
    // Check for performance metrics
    if ('performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming

      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        const domContentLoaded =
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart

        if (loadTime > 3000) {
          this.addCheck(
            'performance',
            'warning',
            `Page load time is ${Math.round(loadTime)}ms (should be < 3000ms)`
          )
        } else {
          this.addCheck('performance', 'pass', `Page load time: ${Math.round(loadTime)}ms`)
        }

        if (domContentLoaded > 1500) {
          this.addCheck(
            'performance',
            'warning',
            `DOM content loaded in ${Math.round(domContentLoaded)}ms (should be < 1500ms)`
          )
        } else {
          this.addCheck(
            'performance',
            'pass',
            `DOM content loaded: ${Math.round(domContentLoaded)}ms`
          )
        }
      }
    }

    // Check for large images
    const images = document.querySelectorAll('img')
    images.forEach((img) => {
      if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
        this.addCheck('performance', 'warning', 'Large image detected (consider optimization)', img)
      }
    })

    // Check for unused CSS (basic check)
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]')
    if (stylesheets.length > 5) {
      this.addCheck(
        'performance',
        'warning',
        `${stylesheets.length} stylesheets loaded (consider combining)`
      )
    }
  }

  private checkSEO(): void {
    // Check for title tag
    const title = document.querySelector('title')
    if (!title || title.textContent?.trim() === '') {
      this.addCheck('seo', 'fail', 'Missing or empty title tag')
    } else if ((title.textContent?.length || 0) > 60) {
      this.addCheck('seo', 'warning', 'Title tag is too long (should be < 60 characters)')
    } else {
      this.addCheck('seo', 'pass', 'Title tag is present and appropriate length')
    }

    // Check for meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription || !metaDescription.getAttribute('content')) {
      this.addCheck('seo', 'fail', 'Missing meta description')
    } else {
      const content = metaDescription.getAttribute('content') || ''
      if (content.length > 160) {
        this.addCheck('seo', 'warning', 'Meta description is too long (should be < 160 characters)')
      } else if (content.length < 120) {
        this.addCheck(
          'seo',
          'warning',
          'Meta description is too short (should be > 120 characters)'
        )
      } else {
        this.addCheck('seo', 'pass', 'Meta description is present and appropriate length')
      }
    }

    // Check for Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const ogImage = document.querySelector('meta[property="og:image"]')

    if (!ogTitle || !ogDescription || !ogImage) {
      this.addCheck('seo', 'warning', 'Missing Open Graph tags for social media sharing')
    } else {
      this.addCheck('seo', 'pass', 'Open Graph tags are present')
    }

    // Check for structured data
    const structuredData = document.querySelector('script[type="application/ld+json"]')
    if (!structuredData) {
      this.addCheck('seo', 'warning', 'No structured data found')
    } else {
      this.addCheck('seo', 'pass', 'Structured data is present')
    }
  }

  private checkResponsiveDesign(): void {
    // Check for viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]')
    if (!viewport) {
      this.addCheck('responsive', 'fail', 'Missing viewport meta tag')
    } else {
      this.addCheck('responsive', 'pass', 'Viewport meta tag is present')
    }

    // Check for responsive images
    const images = document.querySelectorAll('img')
    let responsiveImages = 0

    images.forEach((img) => {
      if (
        img.hasAttribute('srcset') ||
        img.style.maxWidth === '100%' ||
        window.getComputedStyle(img).maxWidth === '100%'
      ) {
        responsiveImages++
      }
    })

    if (images.length > 0) {
      const percentage = (responsiveImages / images.length) * 100
      if (percentage < 50) {
        this.addCheck(
          'responsive',
          'warning',
          `Only ${Math.round(percentage)}% of images are responsive`
        )
      } else {
        this.addCheck('responsive', 'pass', `${Math.round(percentage)}% of images are responsive`)
      }
    }

    // Check for CSS media queries
    let hasMediaQueries = false
    const stylesheets = Array.from(document.styleSheets)

    stylesheets.forEach((stylesheet) => {
      try {
        const rules = Array.from(stylesheet.cssRules || [])
        rules.forEach((rule) => {
          if (rule instanceof CSSMediaRule) {
            hasMediaQueries = true
          }
        })
      } catch {
        // Cross-origin stylesheet, skip
      }
    })

    if (!hasMediaQueries) {
      this.addCheck('responsive', 'warning', 'No CSS media queries detected')
    } else {
      this.addCheck('responsive', 'pass', 'CSS media queries are present')
    }
  }

  private checkBrowserCompatibility(): void {
    // Check for modern JavaScript features
    const features = {
      'ES6 Classes': 'class' in window,
      'Fetch API': 'fetch' in window,
      'CSS Grid': CSS.supports('display', 'grid'),
      'CSS Flexbox': CSS.supports('display', 'flex'),
      'Service Workers': 'serviceWorker' in navigator,
      'Web Components': 'customElements' in window,
    }

    Object.entries(features).forEach(([feature, supported]) => {
      if (supported) {
        this.addCheck('compatibility', 'pass', `${feature} is supported`)
      } else {
        this.addCheck('compatibility', 'warning', `${feature} is not supported`)
      }
    })
  }

  private checkContentQuality(): void {
    // Check for empty content
    const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6')
    let emptyElements = 0

    contentElements.forEach((element) => {
      if (element.textContent?.trim() === '') {
        emptyElements++
      }
    })

    if (emptyElements > 0) {
      this.addCheck('content', 'warning', `${emptyElements} empty content elements found`)
    } else {
      this.addCheck('content', 'pass', 'No empty content elements found')
    }

    // Check for Lorem Ipsum text
    const loremPattern = /lorem ipsum|dolor sit amet/i
    const textContent = document.body.textContent || ''

    if (loremPattern.test(textContent)) {
      this.addCheck('content', 'warning', 'Lorem Ipsum placeholder text detected')
    } else {
      this.addCheck('content', 'pass', 'No placeholder text detected')
    }
  }

  private checkNavigation(): void {
    // Check for navigation landmarks
    const nav = document.querySelector('nav, [role="navigation"]')
    if (!nav) {
      this.addCheck('navigation', 'warning', 'No navigation landmark found')
    } else {
      this.addCheck('navigation', 'pass', 'Navigation landmark is present')
    }

    // Check for skip links
    const skipLink = document.querySelector('a[href="#main"], a[href="#content"]')
    if (!skipLink) {
      this.addCheck('navigation', 'warning', 'No skip navigation link found')
    } else {
      this.addCheck('navigation', 'pass', 'Skip navigation link is present')
    }

    // Check for breadcrumbs (if applicable)
    const breadcrumbs = document.querySelector('[aria-label="breadcrumb"], .breadcrumb')
    if (window.location.pathname !== '/' && !breadcrumbs) {
      this.addCheck('navigation', 'warning', 'No breadcrumb navigation found on non-home page')
    }
  }

  private checkForms(): void {
    const forms = document.querySelectorAll('form')

    forms.forEach((form) => {
      // Check for form validation
      const inputs = form.querySelectorAll('input, textarea, select')
      let hasValidation = false

      inputs.forEach((input) => {
        if (
          input.hasAttribute('required') ||
          input.hasAttribute('pattern') ||
          input.hasAttribute('minlength') ||
          input.hasAttribute('maxlength')
        ) {
          hasValidation = true
        }
      })

      if (inputs.length > 0 && !hasValidation) {
        this.addCheck('forms', 'warning', 'Form has no validation attributes', form)
      }

      // Check for submit button
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]')
      if (!submitButton) {
        this.addCheck('forms', 'warning', 'Form has no submit button', form)
      }
    })
  }

  private checkImages(): void {
    const images = document.querySelectorAll('img')

    images.forEach((img) => {
      // Check for loading attribute
      if (!img.hasAttribute('loading')) {
        this.addCheck('images', 'warning', 'Image missing loading attribute for performance', img)
      }

      // Check for broken images
      if (img.naturalWidth === 0 && img.complete) {
        this.addCheck('images', 'fail', 'Broken image detected', img)
      }

      // Check for appropriate file formats
      const src = img.src || img.dataset.src || ''
      if (src.includes('.gif') && !src.includes('animated')) {
        this.addCheck('images', 'warning', 'Consider using WebP or AVIF instead of GIF', img)
      }
    })
  }

  private checkLinks(): void {
    const links = document.querySelectorAll('a[href]')

    links.forEach((link) => {
      const href = link.getAttribute('href') || ''

      // Check for external links without security attributes
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        if (!link.hasAttribute('rel') || !link.getAttribute('rel')?.includes('noopener')) {
          this.addCheck('security', 'warning', 'External link missing rel="noopener"', link)
        }
      }

      // Check for empty href
      if (href === '' || href === '#') {
        this.addCheck('links', 'warning', 'Link with empty or placeholder href', link)
      }

      // Check for descriptive link text
      const linkText = link.textContent?.trim() || ''
      const genericTexts = ['click here', 'read more', 'learn more', 'here']

      if (genericTexts.some((text) => linkText.toLowerCase().includes(text))) {
        this.addCheck('accessibility', 'warning', 'Link has non-descriptive text', link)
      }
    })
  }

  private addCheck(
    category: string,
    status: 'pass' | 'fail' | 'warning',
    message: string,
    element?: Element
  ): void {
    this.checks.push({
      name: `${category}: ${message}`,
      status,
      message,
      element,
    })
  }

  private generateReport(): QualityReport {
    const summary = {
      passed: this.checks.filter((check) => check.status === 'pass').length,
      failed: this.checks.filter((check) => check.status === 'fail').length,
      warnings: this.checks.filter((check) => check.status === 'warning').length,
    }

    const totalChecks = this.checks.length
    const score =
      totalChecks > 0
        ? Math.round(((summary.passed + summary.warnings * 0.5) / totalChecks) * 100)
        : 0

    return {
      score,
      checks: this.checks,
      summary,
    }
  }
}

export function runQualityAssurance(): Promise<QualityReport> {
  const qa = new QualityAssurance()
  return qa.runAllChecks()
}

export function logQualityReport(report: QualityReport): void {
  console.group('🔍 Quality Assurance Report')
  console.log(`Overall Score: ${report.score}/100`)
  console.log(
    `Passed: ${report.summary.passed}, Failed: ${report.summary.failed}, Warnings: ${report.summary.warnings}`
  )

  report.checks.forEach((check) => {
    const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️'
    console.log(`${icon} ${check.name}`)
    if (check.element) {
      console.log('   Element:', check.element)
    }
  })

  console.groupEnd()
}
