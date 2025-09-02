<template>
  <header class="app-header">
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <!-- Logo/Brand -->
          <router-link to="/" class="brand">
            <span class="brand-text">Portfolio</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="nav-links desktop-nav">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.path"
              class="nav-link"
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
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.path"
              class="mobile-nav-link"
              :class="{ active: $route.name === item.name }"
              @click="closeMobileMenu"
            >
              {{ $t(item.translationKey) }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { NavigationItem } from '@/types'

const isMobileMenuOpen = ref(false)

const navigationItems: NavigationItem[] = [
  { name: 'home', path: '/', translationKey: 'navigation.home' },
  { name: 'projects', path: '/projects', translationKey: 'navigation.projects' },
  { name: 'about', path: '/about', translationKey: 'navigation.about' },
  { name: 'contact', path: '/contact', translationKey: 'navigation.contact' },
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth >= 768) {
    isMobileMenuOpen.value = false
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $border-color;
  transition: all $transition-normal;
}

.navbar {
  padding: $spacing-md 0;
}

.nav-content {
  @include flex-between;
  align-items: center;
}

.brand {
  text-decoration: none;
  color: $primary-color;
  font-weight: bold;
  font-size: $font-size-xl;
  transition: color $transition-normal;

  &:hover {
    color: $secondary-color;
  }

  .brand-text {
    display: inline-block;
  }
}

.desktop-nav {
  display: none;

  @include respond-to(md) {
    display: flex;
    gap: $spacing-lg;
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

  &:hover {
    color: $secondary-color;
    background-color: rgba($secondary-color, 0.1);
  }

  &.active {
    color: $secondary-color;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background-color: $secondary-color;
      border-radius: 1px;
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
    max-height: 300px;
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

  &:hover {
    color: $secondary-color;
    background-color: rgba($secondary-color, 0.1);
  }

  &.active {
    color: $secondary-color;
    background-color: rgba($secondary-color, 0.1);
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
