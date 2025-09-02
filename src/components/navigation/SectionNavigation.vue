<template>
  <nav class="section-navigation" :class="{ 'is-scrolled': isScrolled }">
    <!-- Scroll Progress Indicator -->
    <div class="scroll-progress" :style="{ width: `${scrollProgress}%` }" aria-hidden="true"></div>

    <div class="container">
      <div class="nav-content">
        <!-- Logo/Brand -->
        <router-link to="/" class="brand" @click="handleBrandClick">
          <span class="brand-text">Portfolio</span>
        </router-link>

        <!-- Desktop Section Navigation -->
        <div class="nav-links desktop-nav">
          <button
            v-for="section in sections"
            :key="section.id"
            class="nav-link section-link"
            :class="{ active: activeSection === section.id }"
            @click="scrollToSection(section.id)"
            type="button"
          >
            {{ $t(section.translationKey) }}
          </button>

          <!-- External page links -->
          <router-link
            v-for="item in externalLinks"
            :key="item.name"
            :to="item.path"
            class="nav-link external-link"
            :class="{ active: $route.name === item.name }"
          >
            {{ $t(item.translationKey) }}
          </router-link>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          class="mobile-menu-toggle"
          :class="{ active: isMobileMenuOpen }"
          @click="toggleMobileMenu"
          :aria-label="$t('navigation.toggleMenu')"
          :aria-expanded="isMobileMenuOpen"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div class="mobile-nav" :class="{ open: isMobileMenuOpen }">
        <div class="mobile-nav-links">
          <!-- Section links -->
          <button
            v-for="section in sections"
            :key="section.id"
            class="mobile-nav-link section-link"
            :class="{ active: activeSection === section.id }"
            @click="handleMobileSectionClick(section.id)"
            type="button"
          >
            {{ $t(section.translationKey) }}
          </button>

          <!-- External page links -->
          <router-link
            v-for="item in externalLinks"
            :key="item.name"
            :to="item.path"
            class="mobile-nav-link external-link"
            :class="{ active: $route.name === item.name }"
            @click="closeMobileMenu"
          >
            {{ $t(item.translationKey) }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollNavigation, type NavigationSection } from '@/composables/useScrollNavigation'

interface ExternalLink {
  name: string
  path: string
  translationKey: string
}

interface Props {
  sections: NavigationSection[]
  externalLinks?: ExternalLink[]
}

const props = withDefaults(defineProps<Props>(), {
  externalLinks: () => [],
})

const route = useRoute()
const router = useRouter()

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)

// Use scroll navigation composable
const { activeSection, scrollToSection } = useScrollNavigation(props.sections)

// Scroll progress tracking
const scrollProgress = ref(0)

// Update scroll progress
const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = Math.min((scrollTop / docHeight) * 100, 100)
}

// Removed complex wheel navigation - keeping it simple

// Handle brand click - scroll to top if on home page
const handleBrandClick = () => {
  if (route.name === 'home') {
    scrollToSection(props.sections[0]?.id || 'hero')
  }
}

// Handle mobile section click
const handleMobileSectionClick = (sectionId: string) => {
  scrollToSection(sectionId)
  closeMobileMenu()
}

// Mobile menu controls
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value

  // Prevent body scroll when menu is open
  if (isMobileMenuOpen.value) {
    document.body.classList.add('mobile-menu-open')
  } else {
    document.body.classList.remove('mobile-menu-open')
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.classList.remove('mobile-menu-open')
}

// Enhanced scroll handling
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  updateScrollProgress()
}

// Handle resize
const handleResize = () => {
  if (window.innerWidth >= 768) {
    closeMobileMenu()
  }
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleEscape)

  // Initial scroll check
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleEscape)
  document.body.classList.remove('mobile-menu-open')
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.section-navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition: all $transition-normal;

  &.is-scrolled {
    background: rgba(255, 255, 255, 0.98);
    border-bottom-color: $border-color;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
}

.scroll-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, $secondary-color, $primary-color);
  transition: width 0.1s ease-out;
  z-index: 1001;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 10px rgba($secondary-color, 0.3);
}

.nav-content {
  @include flex-between;
  align-items: center;
  padding: $spacing-md 0;
}

.brand {
  text-decoration: none;
  color: $primary-color;
  font-weight: bold;
  font-size: $font-size-xl;
  transition: all $transition-normal;
  cursor: pointer;

  &:hover {
    color: $secondary-color;
    transform: translateY(-1px);
  }

  .brand-text {
    display: inline-block;
  }
}

.desktop-nav {
  display: none;

  @include respond-to(md) {
    display: flex;
    gap: $spacing-md;
    align-items: center;
  }
}

.nav-link {
  text-decoration: none;
  color: $text-color;
  font-weight: 500;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-md;
  transition: all $transition-normal;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  font-size: $font-size-base;

  &:hover {
    color: $secondary-color;
    background-color: rgba($secondary-color, 0.1);
    transform: translateY(-1px);
  }

  &.active {
    color: $secondary-color;
    background-color: rgba($secondary-color, 0.1);
    transform: translateY(-1px);

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: linear-gradient(90deg, transparent, $secondary-color, transparent);
      border-radius: 1px;
      animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba($secondary-color, 0.1),
        rgba($secondary-color, 0.05)
      );
      border-radius: $border-radius-md;
      z-index: -1;
      opacity: 0;
      animation: activeGlow 0.4s ease-out forwards;
    }
  }

  &.section-link {
    // Specific styles for section navigation buttons
    &:focus {
      outline: 2px solid $secondary-color;
      outline-offset: 2px;
    }
  }

  &.external-link {
    // Specific styles for external page links
    margin-left: $spacing-sm;

    &::before {
      content: '';
      position: absolute;
      left: -#{$spacing-xs};
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 20px;
      background-color: $border-color;
    }
  }
}

.mobile-menu-toggle {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all $transition-normal;

  @include respond-to(md) {
    display: none;
  }

  .hamburger-line {
    width: 24px;
    height: 2px;
    background-color: $primary-color;
    transition: all $transition-normal;
    transform-origin: center;

    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }

  &.active {
    .hamburger-line {
      &:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }

      &:nth-child(2) {
        opacity: 0;
      }

      &:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  }

  &:hover {
    .hamburger-line {
      background-color: $secondary-color;
    }
  }
}

.mobile-nav {
  display: block;
  max-height: 0;
  overflow: hidden;
  transition: max-height $transition-normal ease-in-out;

  @include respond-to(md) {
    display: none;
  }

  &.open {
    max-height: 400px;
  }
}

.mobile-nav-links {
  padding: $spacing-lg 0;
  border-top: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.mobile-nav-link {
  text-decoration: none;
  color: $text-color;
  font-weight: 500;
  padding: $spacing-sm;
  border-radius: $border-radius-md;
  transition: all $transition-normal;
  background: none;
  border: none;
  cursor: pointer;
  font-size: $font-size-base;
  text-align: left;

  &:hover {
    color: $secondary-color;
    background-color: rgba($secondary-color, 0.1);
  }

  &.active {
    color: $secondary-color;
    background-color: rgba($secondary-color, 0.1);
  }

  &.section-link {
    &:focus {
      outline: 2px solid $secondary-color;
      outline-offset: 2px;
    }
  }
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 20px;
    opacity: 1;
  }
}

@keyframes activeGlow {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// Enhanced navigation progress indicator
.section-navigation {
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, $secondary-color, $primary-color);
    transition: width $transition-normal ease-out;
    width: 0;
  }

  &.is-scrolled::after {
    width: 100%;
  }
}

// Prevent body scroll when mobile menu is open
:global(body.mobile-menu-open) {
  overflow: hidden;

  @include respond-to(md) {
    overflow: auto;
  }
}
</style>
