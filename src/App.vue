<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()

// Check if we're on the home page to hide the regular header
const isHomePage = computed(() => route.name === 'home')
</script>

<template>
  <div id="app">
    <!-- Show regular header only for non-home pages -->
    <AppHeader v-if="!isHomePage" />

    <main class="main-content" :class="{ 'home-page': isHomePage }">
      <RouterView />
    </main>

    <AppFooter />
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
