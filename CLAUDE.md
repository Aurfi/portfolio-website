# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern portfolio website built with Vue.js 3, TypeScript, and Vite. The project features internationalization, PWA capabilities, comprehensive testing, and automated deployment to GitHub Pages.

## Key Commands

### Development
```bash
npm run dev                    # Start development server (http://localhost:5173)
npm run preview                # Preview production build locally
npm run dev:test              # Run comprehensive testing (PowerShell)
```

### Building & Deployment
```bash
npm run build                 # Build for production (includes type checking)
npm run build-only            # Build without type checking
npm run deploy                # Build and deploy to GitHub Pages
```

### Testing
```bash
npm run test:unit             # Run unit tests in watch mode
npm run test:unit:run         # Run unit tests once
npm run test:unit:coverage    # Run tests with coverage report
npm run test:e2e              # Run Playwright E2E tests
npm run test:accessibility    # Run accessibility tests
```

### Code Quality
```bash
npm run lint                  # Run ESLint with auto-fix
npm run format                # Format code with Prettier
npm run format:check          # Check formatting without changes
npm run type-check            # Run TypeScript type checking
npm run integration:final     # Run comprehensive integration checks
```

## Architecture & Code Patterns

### Component Structure
- **Composition API**: All components use Vue 3 Composition API with `<script setup>` syntax
- **TypeScript**: Strict TypeScript throughout with comprehensive type definitions
- **Styling**: SCSS with CSS custom properties, scoped styles per component
- **Organization**: Components grouped by purpose (layout/, sections/, ui/, projects/)

### Key Composables
- `useTheme`: Theme management with auto/light/dark/high-contrast modes
- `useI18n`: Internationalization support (currently English)
- `usePerformanceOptimization`: Performance monitoring and optimization
- `useAccessibility`: Accessibility enhancements and keyboard navigation
- `usePWA`: Progressive Web App functionality
- `useScrollReveal`: Scroll-based animations

### Routing Architecture
- Vue Router with lazy-loaded routes for code splitting
- GitHub Pages SPA fallback handling in router configuration
- Smooth scroll behavior with hash navigation support
- Route-based meta tags for SEO

### State Management
- Pinia for reactive state management
- Composables for local component state
- localStorage for user preferences (theme, language)

### Build Configuration
- **Vite**: Fast development and optimized production builds
- **Code Splitting**: Manual chunks for vendors, components, composables
- **Compression**: Gzip and Brotli compression for production
- **Legacy Support**: Polyfills for older browsers via @vitejs/plugin-legacy
- **Base URL**: `/portfolio-website/` in production for GitHub Pages

## Critical Implementation Notes

### Known Issues & Fixes

1. **vite-plugin-compression Import**: Use default import, not named import
   ```typescript
   import compression from 'vite-plugin-compression' // ✓ Correct
   ```

2. **TypeScript Warnings**: Replace `any` types with proper interfaces, especially in:
   - `src/utils/finalIntegration.ts`
   - Performance monitoring functions
   - Analytics event handlers

3. **Test Configuration**: Vue template warnings require proper test setup in `src/test/setup.ts`

### Performance Considerations
- Images should be optimized and use modern formats (WebP/AVIF) with fallbacks
- Lazy loading implemented for non-critical components and images
- Core Web Vitals monitoring integrated (`web-vitals` package)
- Bundle size budgets enforced in build configuration

### Accessibility Requirements
- WCAG 2.1 AA compliance required
- All interactive elements must be keyboard accessible
- Proper ARIA attributes and semantic HTML
- Focus management for route changes and modal interactions

### Security Best Practices
- Content Security Policy headers configured
- Input validation and sanitization for contact forms
- No secrets or API keys in code
- Dependency vulnerability scanning in CI/CD

## Development Workflow

### Git Workflow
- Main branch deploys to GitHub Pages automatically
- Feature branches for new development
- Pull requests required for main branch changes

### Testing Strategy
1. Unit tests for all composables and utilities
2. Component testing with Vue Test Utils
3. E2E testing for critical user journeys
4. Accessibility testing with axe-core
5. Performance testing with Lighthouse

### Deployment Process
1. Push to main branch triggers GitHub Actions
2. Workflow runs tests, linting, and type checking
3. Builds optimized production bundle
4. Deploys to GitHub Pages with proper base URL
5. Post-deployment validation and monitoring

## Project Requirements (from .kiro/specs)

The project has comprehensive requirements for:
- Build process reliability and optimization
- TypeScript quality and type safety
- Test coverage and infrastructure
- Performance optimization (Core Web Vitals)
- Error handling and monitoring
- Asset optimization and caching
- Development experience improvements
- Security hardening
- Documentation and code organization
- CI/CD pipeline enhancements

Refer to `.kiro/specs/codebase-analysis-fixes/` for detailed requirements, design decisions, and implementation tasks.

## Common Development Tasks

### Adding a New Component
1. Create component in appropriate directory under `src/components/`
2. Use Composition API with TypeScript
3. Add proper type definitions for props and emits
4. Include unit tests in same directory
5. Follow existing naming conventions and patterns

### Adding a New Route
1. Define route in `src/router/index.ts`
2. Create view component in `src/views/`
3. Use lazy loading for route component
4. Add route meta for title and auth requirements
5. Update navigation components if needed

### Updating Translations
1. Edit `src/locales/en.json`
2. Use translation keys in components via `useI18n` composable
3. Keep translations organized by section
4. Test all language variations

### Performance Optimization
1. Check bundle size with `npm run build` (generates stats.html)
2. Use lazy loading for large components
3. Optimize images before adding to project
4. Monitor Core Web Vitals in development
5. Test on various network conditions

## Important Files & Directories

- `vite.config.ts`: Build configuration and optimization settings
- `src/composables/`: Reusable composition functions
- `src/utils/finalIntegration.ts`: Production optimization utilities
- `scripts/final-integration.cjs`: Quality assurance and validation
- `public/sw.js`: Service worker for PWA functionality
- `.github/workflows/`: CI/CD pipeline configuration