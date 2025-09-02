<script setup lang="ts">
import { onMounted } from 'vue'
import SectionNavigation from '@/components/navigation/SectionNavigation.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import type { NavigationSection } from '@/composables/useScrollNavigation'

// Define sections for navigation
const sections: NavigationSection[] = [
  { id: 'hero', name: 'hero', translationKey: 'navigation.home' },
  { id: 'projects', name: 'projects', translationKey: 'navigation.projects' },
  { id: 'about', name: 'about', translationKey: 'navigation.about' },
  { id: 'contact', name: 'contact', translationKey: 'navigation.contact' },
]

// External links for pages that aren't sections
const externalLinks = [
  { name: 'projects', path: '/projects', translationKey: 'navigation.allProjects' },
]

onMounted(() => {
  // Ensure smooth scrolling is enabled
  document.documentElement.style.scrollBehavior = 'smooth'
})
</script>

<template>
  <div class="home-page">
    <!-- Section-based Navigation -->
    <SectionNavigation :sections="sections" :external-links="externalLinks" />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <HeroSection id="hero" class="section" />

      <!-- Projects Section -->
      <ProjectsSection id="projects" class="section" />

      <!-- About Section -->
      <AboutSection id="about" class="section" />

      <!-- Contact Section -->
      <ContactSection id="contact" class="section" />
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.home-page {
  min-height: 100vh;
}

.main-content {
  padding-top: 80px; // Account for fixed header
}

// Simple, clean section styling
:global(.section) {
  min-height: 100vh;
  padding: $spacing-xl 0;

  &:first-child {
    padding-top: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-md;
  }
}

// Native smooth scrolling
:global(html) {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

// Mobile adjustments
@media (max-width: $breakpoint-md) {
  .main-content {
    padding-top: 70px;
  }

  :global(html) {
    scroll-padding-top: 70px;
  }

  :global(.section) {
    min-height: auto;
    padding: $spacing-lg 0;
  }
}
</style>
