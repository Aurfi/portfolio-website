<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed, onErrorCaptured } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt.vue'
import PerformanceMonitor from '@/components/ui/PerformanceMonitor.vue'
import SkipNavigation from '@/components/ui/SkipNavigation.vue'
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useTheme } from '@/composables/useTheme'
import { usePWA, useWebVitals } from '@/composables/usePWA'
import { useEnhancedAnimations } from '@/composables/useEnhancedAnimations'
import { usePerformanceOptimization } from '@/composables/usePerformanceOptimization'
import { finalIntegration } from '@/utils/finalIntegration'

const route = useRoute()

// Initialize scroll reveal animations
useScrollReveal()

// Initialize theme system
useTheme()

// Initialize PWA functionality
const { state: pwaState } = usePWA()

// Initialize Web Vitals monitoring
useWebVitals()

// Initialize enhanced animations
useEnhancedAnimations()

// Initialize performance optimizations
usePerformanceOptimization()

// Initialize final integration and polish features
finalIntegration.initialize().catch((error: Error) => {
  console.error('Failed to initialize final integration:', error)
})

// Global error handler
onErrorCaptured((error: Error, instance, info) => {
  console.error('Global error caught:', error)

  // Send to analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      custom_map: {
        component: instance?.$?.type?.name || 'Unknown',
        info: info,
      },
    })
  }

  // Let the error boundary handle it
  return true
})

// Check if we're on the home page to hide the regular header
const isHomePage = computed(() => route.name === 'home')
</script>

<template>
  <div id="app">
    <!-- Skip Navigation Links -->
    <SkipNavigation />

    <!-- Show regular header only for non-home pages -->
    <AppHeader v-if="!isHomePage" />

    <main id="main-content" class="main-content" :class="{ 'home-page': isHomePage }" tabindex="-1">
      <ErrorBoundary>
        <RouterView />
      </ErrorBoundary>
    </main>

    <AppFooter />

    <!-- PWA Install Prompt -->
    <PWAInstallPrompt />

    <!-- Performance Monitor (Development Only) -->
    <PerformanceMonitor />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;

  // Regular pages with header
  &:not(.home-page) {
    padding-top: 80px; // Account for fixed header
    min-height: calc(100vh - 80px);
  }

  // Home page with section navigation
  &.home-page {
    padding-top: 0;
    min-height: 100vh;
  }
}

// Enhanced global smooth scrolling with performance optimization
:global(html) {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; // Account for fixed header
}

// Optimize scroll performance
:global(body) {
  scroll-behavior: smooth;
  overflow-x: hidden; // Prevent horizontal scroll
}

// Performance optimizations for smooth scrolling
:global(*) {
  // Only apply smooth scrolling to elements that need it
  &.smooth-scroll {
    scroll-behavior: smooth;
  }
}

// Reduce motion for accessibility
@media (prefers-reduced-motion: reduce) {
  :global(html),
  :global(body),
  :global(*) {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
