<template>
  <div class="theme-toggle">
    <!-- Simple Toggle Button -->
    <button
      v-if="variant === 'simple'"
      class="theme-toggle-button simple"
      @click="toggleTheme"
      :title="`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`"
      :aria-label="`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`"
    >
      <span class="theme-icon">{{ currentIcon }}</span>
    </button>

    <!-- Dropdown Selector -->
    <div v-else-if="variant === 'dropdown'" class="theme-dropdown" ref="dropdownRef">
      <button
        class="theme-toggle-button dropdown"
        @click="toggleDropdown"
        :aria-expanded="isDropdownOpen"
        aria-haspopup="true"
      >
        <span class="theme-icon">{{ currentIcon }}</span>
        <span class="theme-label">{{ currentLabel }}</span>
        <svg
          class="dropdown-arrow"
          :class="{ open: isDropdownOpen }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      <Transition name="dropdown">
        <div v-if="isDropdownOpen" class="theme-dropdown-menu">
          <button
            v-for="theme in availableThemes"
            :key="theme"
            class="theme-option"
            :class="{ active: currentTheme === theme }"
            @click="selectTheme(theme)"
          >
            <span class="theme-icon">{{ themeIcons[theme] }}</span>
            <span class="theme-label">{{ themeLabels[theme] }}</span>
            <svg
              v-if="currentTheme === theme"
              class="check-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </button>
        </div>
      </Transition>
    </div>

    <!-- Segmented Control -->
    <div v-else-if="variant === 'segmented'" class="theme-segmented">
      <div class="segmented-control">
        <button
          v-for="theme in ['light', 'dark']"
          :key="theme"
          class="segmented-option"
          :class="{ active: resolvedTheme === theme }"
          @click="setTheme(theme as Theme)"
        >
          <span class="theme-icon">{{ themeIcons[theme as Theme] }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useTheme, type Theme } from '@/composables/useTheme'

interface Props {
  variant?: 'simple' | 'dropdown' | 'segmented'
  showLabel?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'simple',
  showLabel: false,
})

const { currentTheme, resolvedTheme, setTheme, toggleTheme, themeLabels, themeIcons } = useTheme()

// Dropdown state
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

// Available themes for dropdown
const availableThemes: Theme[] = ['light', 'dark', 'auto', 'high-contrast']

// Current theme display
const currentIcon = computed(() => themeIcons.value[currentTheme.value as Theme])
const currentLabel = computed(() => themeLabels.value[currentTheme.value as Theme])

// Dropdown methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectTheme = (theme: Theme) => {
  setTheme(theme)
  isDropdownOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.theme-toggle {
  position: relative;
}

.theme-toggle-button {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm;
  border: 1px solid var(--color-border);
  border-radius: $border-radius-md;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition: all $transition-normal;
  font-size: $font-size-sm;

  &:hover {
    background: var(--color-background-light);
    border-color: var(--color-primary);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-primary);
  }

  &.simple {
    width: 40px;
    height: 40px;
    justify-content: center;
    border-radius: $border-radius-full;
  }

  &.dropdown {
    min-width: 120px;
    justify-content: space-between;
  }
}

.theme-icon {
  font-size: 18px;
  line-height: 1;
}

.theme-label {
  font-weight: 500;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  transition: transform $transition-normal;

  &.open {
    transform: rotate(180deg);
  }
}

// Dropdown Menu
.theme-dropdown {
  position: relative;
}

.theme-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 180px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: $border-radius-lg;
  box-shadow: $shadow-lg;
  z-index: $z-dropdown;
  overflow: hidden;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  width: 100%;
  padding: $spacing-sm $spacing-md;
  border: none;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color $transition-fast;
  font-size: $font-size-sm;

  &:hover {
    background: var(--color-background-light);
  }

  &.active {
    background: var(--color-primary);
    color: white;
  }
}

.check-icon {
  width: 16px;
  height: 16px;
  margin-left: auto;
}

// Segmented Control
.theme-segmented {
  .segmented-control {
    display: flex;
    background: var(--color-background-light);
    border-radius: $border-radius-lg;
    padding: 2px;
    border: 1px solid var(--color-border);
  }

  .segmented-option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: calc(#{$border-radius-lg} - 2px);
    cursor: pointer;
    transition: all $transition-fast;
    color: var(--color-text-light);

    &:hover {
      color: var(--color-text);
    }

    &.active {
      background: var(--color-background);
      color: var(--color-primary);
      box-shadow: $shadow-sm;
    }
  }
}

// Dropdown Animation
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s $ease-out-quart;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
