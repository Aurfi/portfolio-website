<template>
  <header class="app-header">
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <!-- Logo/Brand -->
          <router-link to="/" class="brand">
            <PersonalLogo
              variant="combined"
              size="sm"
              :show-full-name="true"
              :show-tagline="false"
            />
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="nav-links desktop-nav" aria-label="Main navigation">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.path"
              class="nav-link"
              :class="{ active: $route.name === item.name }"
            >
              {{ $t(item.translationKey) }}
            </router-link>
          </nav>


          <!-- Mobile Menu Toggle -->
          <button
            class="mobile-menu-toggle"
            :class="{ active: isMobileMenuOpen }"
            @click="toggleMobileMenu"
            :aria-label="$t('navigation.toggleMenu')"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-nav"
            type="button"
          >
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <div
          id="mobile-nav"
          class="mobile-nav"
          :class="{ open: isMobileMenuOpen }"
          :aria-hidden="!isMobileMenuOpen"
        >
          <nav class="mobile-nav-links" aria-label="Mobile navigation">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.path"
              class="mobile-nav-link"
              :class="{ active: $route.name === item.name }"
              @click="closeMobileMenu"
              :tabindex="isMobileMenuOpen ? 0 : -1"
            >
              {{ $t(item.translationKey) }}
            </router-link>
          </nav>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PersonalLogo from '@/components/ui/PersonalLogo.vue'
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

  // Manage body scroll and focus
  if (isMobileMenuOpen.value) {
    document.body.classList.add('mobile-menu-open')
    // Focus first mobile nav link after menu opens
    setTimeout(() => {
      const firstLink = document.querySelector('.mobile-nav-link') as HTMLElement
      firstLink?.focus()
    }, 100)
  } else {
    document.body.classList.remove('mobile-menu-open')
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.classList.remove('mobile-menu-open')
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
  z-index: $z-fixed;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--color-border);
  transition: all $transition-normal;
}

.navbar {
  padding: $spacing-md 0;
}

.nav-content {
  @include flex-between;
  align-items: center;
  gap: $spacing-md;
}

.brand {
  text-decoration: none;
  transition: transform $transition-normal;

  &:hover {
    transform: scale(1.02);
  }
}

.desktop-nav {
  display: none;

  @include respond-to(md) {
    display: flex;
    gap: $spacing-lg;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  @include respond-to(md) {
    gap: $spacing-md;
  }
}

.nav-link {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-md;
  transition: all $transition-normal;
  position: relative;

  &:hover {
    color: var(--color-primary);
    background-color: var(--color-background-light);
  }

  &.active {
    color: var(--color-primary);

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background-color: var(--color-primary);
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
    background-color: var(--color-text);
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
      background-color: var(--color-primary);
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
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.mobile-nav-link {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  padding: $spacing-sm;
  border-radius: $border-radius-md;
  transition: all $transition-normal;

  &:hover {
    color: var(--color-primary);
    background-color: var(--color-background-light);
  }

  &.active {
    color: var(--color-primary);
    background-color: var(--color-background-light);
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
