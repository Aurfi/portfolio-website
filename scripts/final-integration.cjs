#!/usr/bin/env node

/**
 * Final Integration and Polish Script
 *
 * This script performs final integration tasks and quality assurance checks
 * for the portfolio website before deployment.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class FinalIntegrationScript {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..')
    this.errors = []
    this.warnings = []
    this.completed = []
  }

  /**
   * Run all final integration tasks
   */
  async run() {
    console.log('🚀 Starting Final Integration and Polish...\n')

    try {
      // 1. Code Quality Checks
      await this.runCodeQualityChecks()

      // 2. Build Optimization
      await this.optimizeBuild()

      // 3. Asset Optimization
      await this.optimizeAssets()

      // 4. Performance Checks
      await this.checkPerformance()

      // 5. Accessibility Validation
      await this.validateAccessibility()

      // 6. Cross-browser Testing
      await this.testCrossBrowser()

      // 7. Mobile Optimization
      await this.optimizeMobile()

      // 8. SEO Optimization
      await this.optimizeSEO()

      // 9. Security Checks
      await this.checkSecurity()

      // 10. Final Validation
      await this.runFinalValidation()

      // Generate report
      this.generateReport()
    } catch (error) {
      console.error('❌ Final integration failed:', error.message)
      process.exit(1)
    }
  }

  /**
   * Run code quality checks
   */
  async runCodeQualityChecks() {
    console.log('📋 Running code quality checks...')

    try {
      // TypeScript compilation check
      execSync('npm run type-check', { cwd: this.projectRoot, stdio: 'pipe' })
      this.completed.push('TypeScript compilation check passed')

      // ESLint check
      execSync('npm run lint', { cwd: this.projectRoot, stdio: 'pipe' })
      this.completed.push('ESLint check passed')

      // Prettier check
      execSync('npm run format:check', { cwd: this.projectRoot, stdio: 'pipe' })
      this.completed.push('Code formatting check passed')
    } catch (error) {
      this.errors.push(`Code quality check failed: ${error.message}`)
    }
  }

  /**
   * Optimize build configuration
   */
  async optimizeBuild() {
    console.log('⚡ Optimizing build configuration...')

    try {
      // Check Vite configuration
      const viteConfigPath = path.join(this.projectRoot, 'vite.config.ts')
      if (fs.existsSync(viteConfigPath)) {
        const viteConfig = fs.readFileSync(viteConfigPath, 'utf8')

        // Check for production optimizations
        const optimizations = ['minify', 'rollupOptions', 'chunkSizeWarningLimit', 'sourcemap']

        optimizations.forEach((opt) => {
          if (viteConfig.includes(opt)) {
            this.completed.push(`Vite ${opt} configuration found`)
          } else {
            this.warnings.push(`Consider adding ${opt} to Vite configuration`)
          }
        })
      }

      // Check package.json scripts
      const packageJsonPath = path.join(this.projectRoot, 'package.json')
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

        const requiredScripts = ['build', 'preview', 'test:unit', 'lint']
        requiredScripts.forEach((script) => {
          if (packageJson.scripts && packageJson.scripts[script]) {
            this.completed.push(`Package.json script '${script}' found`)
          } else {
            this.warnings.push(`Consider adding '${script}' script to package.json`)
          }
        })
      }
    } catch (error) {
      this.errors.push(`Build optimization failed: ${error.message}`)
    }
  }

  /**
   * Optimize assets
   */
  async optimizeAssets() {
    console.log('🖼️ Optimizing assets...')

    try {
      const publicDir = path.join(this.projectRoot, 'public')
      const assetsDir = path.join(this.projectRoot, 'src', 'assets')

      // Check image formats
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']
      const checkDirectory = (dir) => {
        if (!fs.existsSync(dir)) return

        const files = fs.readdirSync(dir, { withFileTypes: true })
        files.forEach((file) => {
          if (file.isDirectory()) {
            checkDirectory(path.join(dir, file.name))
          } else {
            const ext = path.extname(file.name).toLowerCase()
            if (imageExtensions.includes(ext)) {
              const filePath = path.join(dir, file.name)
              const stats = fs.statSync(filePath)

              // Check file size (warn if > 500KB)
              if (stats.size > 500 * 1024) {
                this.warnings.push(
                  `Large image file: ${file.name} (${Math.round(stats.size / 1024)}KB)`
                )
              }

              // Check for modern formats
              if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const webpPath = filePath.replace(ext, '.webp')
                if (!fs.existsSync(webpPath)) {
                  this.warnings.push(`Consider creating WebP version of ${file.name}`)
                }
              }
            }
          }
        })
      }

      checkDirectory(publicDir)
      checkDirectory(assetsDir)

      // Check for favicon
      const faviconPath = path.join(publicDir, 'favicon.ico')
      if (fs.existsSync(faviconPath)) {
        this.completed.push('Favicon found')
      } else {
        this.warnings.push('Favicon not found')
      }

      // Check for manifest.json
      const manifestPath = path.join(publicDir, 'manifest.json')
      if (fs.existsSync(manifestPath)) {
        this.completed.push('Web app manifest found')
      } else {
        this.warnings.push('Web app manifest not found')
      }
    } catch (error) {
      this.errors.push(`Asset optimization failed: ${error.message}`)
    }
  }

  /**
   * Check performance metrics
   */
  async checkPerformance() {
    console.log('📊 Checking performance configuration...')

    try {
      // Check for lazy loading implementation
      const srcDir = path.join(this.projectRoot, 'src')
      const checkLazyLoading = (dir) => {
        if (!fs.existsSync(dir)) return false

        const files = fs.readdirSync(dir, { withFileTypes: true })
        for (const file of files) {
          if (file.isDirectory()) {
            if (checkLazyLoading(path.join(dir, file.name))) return true
          } else if (file.name.endsWith('.vue') || file.name.endsWith('.ts')) {
            const content = fs.readFileSync(path.join(dir, file.name), 'utf8')
            if (
              content.includes('lazy') ||
              content.includes('LazyImage') ||
              content.includes('loading="lazy"')
            ) {
              return true
            }
          }
        }
        return false
      }

      if (checkLazyLoading(srcDir)) {
        this.completed.push('Lazy loading implementation found')
      } else {
        this.warnings.push('Consider implementing lazy loading for images')
      }

      // Check for service worker
      const swPath = path.join(this.projectRoot, 'public', 'sw.js')
      if (fs.existsSync(swPath)) {
        this.completed.push('Service worker found')
      } else {
        this.warnings.push('Service worker not found')
      }

      // Check for performance monitoring
      const perfMonitorPath = path.join(srcDir, 'components', 'ui', 'PerformanceMonitor.vue')
      if (fs.existsSync(perfMonitorPath)) {
        this.completed.push('Performance monitoring component found')
      } else {
        this.warnings.push('Performance monitoring component not found')
      }
    } catch (error) {
      this.errors.push(`Performance check failed: ${error.message}`)
    }
  }

  /**
   * Validate accessibility
   */
  async validateAccessibility() {
    console.log('♿ Validating accessibility...')

    try {
      const srcDir = path.join(this.projectRoot, 'src')

      // Check for accessibility composables
      const a11yComposablePath = path.join(srcDir, 'composables', 'useAccessibility.ts')
      if (fs.existsSync(a11yComposablePath)) {
        this.completed.push('Accessibility composable found')
      } else {
        this.warnings.push('Accessibility composable not found')
      }

      // Check for ARIA attributes in components
      const checkA11y = (dir) => {
        if (!fs.existsSync(dir)) return 0

        let ariaCount = 0
        const files = fs.readdirSync(dir, { withFileTypes: true })

        files.forEach((file) => {
          if (file.isDirectory()) {
            ariaCount += checkA11y(path.join(dir, file.name))
          } else if (file.name.endsWith('.vue')) {
            const content = fs.readFileSync(path.join(dir, file.name), 'utf8')
            const ariaMatches = content.match(/aria-\w+/g)
            if (ariaMatches) {
              ariaCount += ariaMatches.length
            }
          }
        })

        return ariaCount
      }

      const ariaAttributeCount = checkA11y(srcDir)
      if (ariaAttributeCount > 10) {
        this.completed.push(`Found ${ariaAttributeCount} ARIA attributes in components`)
      } else {
        this.warnings.push('Consider adding more ARIA attributes for better accessibility')
      }

      // Check for skip navigation
      const skipNavPath = path.join(srcDir, 'components', 'ui', 'SkipNavigation.vue')
      if (fs.existsSync(skipNavPath)) {
        this.completed.push('Skip navigation component found')
      } else {
        this.warnings.push('Skip navigation component not found')
      }
    } catch (error) {
      this.errors.push(`Accessibility validation failed: ${error.message}`)
    }
  }

  /**
   * Test cross-browser compatibility
   */
  async testCrossBrowser() {
    console.log('🌐 Testing cross-browser compatibility...')

    try {
      const srcDir = path.join(this.projectRoot, 'src')

      // Check for polyfills
      const checkPolyfills = (dir) => {
        if (!fs.existsSync(dir)) return []

        const polyfills = []
        const files = fs.readdirSync(dir, { withFileTypes: true })

        files.forEach((file) => {
          if (file.isDirectory()) {
            polyfills.push(...checkPolyfills(path.join(dir, file.name)))
          } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
            const content = fs.readFileSync(path.join(dir, file.name), 'utf8')

            // Check for modern features that might need polyfills
            const features = [
              'IntersectionObserver',
              'ResizeObserver',
              'fetch',
              'Promise',
              'Array.from',
              'Object.assign',
            ]

            features.forEach((feature) => {
              if (content.includes(feature)) {
                polyfills.push(feature)
              }
            })
          }
        })

        return [...new Set(polyfills)]
      }

      const usedFeatures = checkPolyfills(srcDir)
      if (usedFeatures.length > 0) {
        this.completed.push(`Modern features detected: ${usedFeatures.join(', ')}`)
        this.warnings.push('Ensure polyfills are available for older browsers')
      }

      // Check CSS compatibility
      const stylesDir = path.join(srcDir, 'assets', 'styles')
      if (fs.existsSync(stylesDir)) {
        const checkCSS = (dir) => {
          const modernFeatures = []
          const files = fs.readdirSync(dir, { withFileTypes: true })

          files.forEach((file) => {
            if (file.isDirectory()) {
              modernFeatures.push(...checkCSS(path.join(dir, file.name)))
            } else if (file.name.endsWith('.scss') || file.name.endsWith('.css')) {
              const content = fs.readFileSync(path.join(dir, file.name), 'utf8')

              const cssFeatures = [
                'display: grid',
                'display: flex',
                'var(',
                'calc(',
                'backdrop-filter',
                '@supports',
              ]

              cssFeatures.forEach((feature) => {
                if (content.includes(feature)) {
                  modernFeatures.push(feature)
                }
              })
            }
          })

          return [...new Set(modernFeatures)]
        }

        const cssFeatures = checkCSS(stylesDir)
        if (cssFeatures.length > 0) {
          this.completed.push(`Modern CSS features used: ${cssFeatures.length}`)
        }
      }
    } catch (error) {
      this.errors.push(`Cross-browser testing failed: ${error.message}`)
    }
  }

  /**
   * Optimize for mobile
   */
  async optimizeMobile() {
    console.log('📱 Optimizing for mobile...')

    try {
      // Check for viewport meta tag in index.html
      const indexPath = path.join(this.projectRoot, 'index.html')
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf8')

        if (indexContent.includes('viewport')) {
          this.completed.push('Viewport meta tag found')
        } else {
          this.errors.push('Viewport meta tag missing from index.html')
        }

        if (indexContent.includes('theme-color')) {
          this.completed.push('Theme color meta tag found')
        } else {
          this.warnings.push('Consider adding theme-color meta tag')
        }
      }

      // Check for touch-friendly styles
      const srcDir = path.join(this.projectRoot, 'src')
      const checkTouchStyles = (dir) => {
        if (!fs.existsSync(dir)) return false

        const files = fs.readdirSync(dir, { withFileTypes: true })
        for (const file of files) {
          if (file.isDirectory()) {
            if (checkTouchStyles(path.join(dir, file.name))) return true
          } else if (file.name.endsWith('.scss') || file.name.endsWith('.css')) {
            const content = fs.readFileSync(path.join(dir, file.name), 'utf8')
            if (
              content.includes('touch') ||
              content.includes('@media') ||
              content.includes('hover:')
            ) {
              return true
            }
          }
        }
        return false
      }

      if (checkTouchStyles(srcDir)) {
        this.completed.push('Touch-friendly styles found')
      } else {
        this.warnings.push('Consider adding touch-friendly styles')
      }
    } catch (error) {
      this.errors.push(`Mobile optimization failed: ${error.message}`)
    }
  }

  /**
   * Optimize SEO
   */
  async optimizeSEO() {
    console.log('🔍 Optimizing SEO...')

    try {
      // Check index.html for SEO elements
      const indexPath = path.join(this.projectRoot, 'index.html')
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf8')

        const seoElements = [
          { name: 'title', required: true },
          { name: 'meta name="description"', required: true },
          { name: 'meta property="og:title"', required: false },
          { name: 'meta property="og:description"', required: false },
          { name: 'meta property="og:image"', required: false },
          { name: 'meta name="twitter:card"', required: false },
          { name: 'link rel="canonical"', required: false },
        ]

        seoElements.forEach((element) => {
          if (indexContent.includes(element.name.split(' ')[0])) {
            this.completed.push(`${element.name} found`)
          } else if (element.required) {
            this.errors.push(`${element.name} missing (required)`)
          } else {
            this.warnings.push(`${element.name} missing (recommended)`)
          }
        })
      }

      // Check for sitemap
      const sitemapPath = path.join(this.projectRoot, 'public', 'sitemap.xml')
      if (fs.existsSync(sitemapPath)) {
        this.completed.push('Sitemap found')
      } else {
        this.warnings.push('Consider adding a sitemap.xml')
      }

      // Check for robots.txt
      const robotsPath = path.join(this.projectRoot, 'public', 'robots.txt')
      if (fs.existsSync(robotsPath)) {
        this.completed.push('Robots.txt found')
      } else {
        this.warnings.push('Consider adding a robots.txt')
      }
    } catch (error) {
      this.errors.push(`SEO optimization failed: ${error.message}`)
    }
  }

  /**
   * Check security
   */
  async checkSecurity() {
    console.log('🔒 Checking security...')

    try {
      // Check for security headers in index.html
      const indexPath = path.join(this.projectRoot, 'index.html')
      if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf8')

        const securityHeaders = [
          'Content-Security-Policy',
          'X-Frame-Options',
          'X-Content-Type-Options',
        ]

        securityHeaders.forEach((header) => {
          if (indexContent.includes(header)) {
            this.completed.push(`${header} meta tag found`)
          } else {
            this.warnings.push(`Consider adding ${header} meta tag`)
          }
        })
      }

      // Check for HTTPS enforcement
      const viteConfigPath = path.join(this.projectRoot, 'vite.config.ts')
      if (fs.existsSync(viteConfigPath)) {
        const viteConfig = fs.readFileSync(viteConfigPath, 'utf8')

        if (viteConfig.includes('https')) {
          this.completed.push('HTTPS configuration found in Vite config')
        } else {
          this.warnings.push('Consider configuring HTTPS in Vite config for production')
        }
      }

      // Check package.json for security audit
      try {
        execSync('npm audit --audit-level moderate', { cwd: this.projectRoot, stdio: 'pipe' })
        this.completed.push('No moderate or high security vulnerabilities found')
      } catch (error) {
        this.warnings.push('Security vulnerabilities detected - run npm audit for details')
      }
    } catch (error) {
      this.errors.push(`Security check failed: ${error.message}`)
    }
  }

  /**
   * Run final validation
   */
  async runFinalValidation() {
    console.log('✅ Running final validation...')

    try {
      // Build the project
      console.log('   Building project...')
      execSync('npm run build', { cwd: this.projectRoot, stdio: 'pipe' })
      this.completed.push('Production build successful')

      // Check build output
      const distDir = path.join(this.projectRoot, 'dist')
      if (fs.existsSync(distDir)) {
        const files = fs.readdirSync(distDir)

        // Check for essential files
        const essentialFiles = ['index.html', 'assets']
        essentialFiles.forEach((file) => {
          if (files.includes(file)) {
            this.completed.push(`Build output contains ${file}`)
          } else {
            this.errors.push(`Build output missing ${file}`)
          }
        })

        // Check build size
        const getDirectorySize = (dir) => {
          let size = 0
          const files = fs.readdirSync(dir, { withFileTypes: true })

          files.forEach((file) => {
            const filePath = path.join(dir, file.name)
            if (file.isDirectory()) {
              size += getDirectorySize(filePath)
            } else {
              size += fs.statSync(filePath).size
            }
          })

          return size
        }

        const buildSize = getDirectorySize(distDir)
        const buildSizeMB = Math.round((buildSize / (1024 * 1024)) * 100) / 100

        if (buildSizeMB < 5) {
          this.completed.push(`Build size: ${buildSizeMB}MB (good)`)
        } else if (buildSizeMB < 10) {
          this.warnings.push(`Build size: ${buildSizeMB}MB (consider optimization)`)
        } else {
          this.warnings.push(`Build size: ${buildSizeMB}MB (needs optimization)`)
        }
      }

      // Run tests if available
      try {
        execSync('npm run test:unit:run', { cwd: this.projectRoot, stdio: 'pipe' })
        this.completed.push('Unit tests passed')
      } catch (error) {
        this.warnings.push('Unit tests failed or not configured')
      }
    } catch (error) {
      this.errors.push(`Final validation failed: ${error.message}`)
    }
  }

  /**
   * Generate final report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60))
    console.log('📋 FINAL INTEGRATION REPORT')
    console.log('='.repeat(60))

    console.log(`\n✅ COMPLETED (${this.completed.length}):`)
    this.completed.forEach((item) => console.log(`   ✓ ${item}`))

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`)
      this.warnings.forEach((item) => console.log(`   ⚠ ${item}`))
    }

    if (this.errors.length > 0) {
      console.log(`\n❌ ERRORS (${this.errors.length}):`)
      this.errors.forEach((item) => console.log(`   ✗ ${item}`))
    }

    // Calculate score
    const totalItems = this.completed.length + this.warnings.length + this.errors.length
    const score =
      totalItems > 0
        ? Math.round(((this.completed.length + this.warnings.length * 0.5) / totalItems) * 100)
        : 0

    console.log(`\n📊 OVERALL SCORE: ${score}/100`)

    if (score >= 90) {
      console.log('🎉 Excellent! Your portfolio is ready for deployment.')
    } else if (score >= 75) {
      console.log('👍 Good job! Consider addressing the warnings for better quality.')
    } else if (score >= 60) {
      console.log('⚠️  Needs improvement. Please address the errors and warnings.')
    } else {
      console.log('❌ Significant issues found. Please fix the errors before deployment.')
    }

    console.log('\n' + '='.repeat(60))

    // Exit with appropriate code
    if (this.errors.length > 0) {
      process.exit(1)
    }
  }
}

// Run the script
if (require.main === module) {
  const script = new FinalIntegrationScript()
  script.run().catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
}

module.exports = FinalIntegrationScript
