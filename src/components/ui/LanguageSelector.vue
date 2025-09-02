<template>
  <div class="language-selector">
    <label for="language-select" class="sr-only">
      {{ t('footer.selectLanguage') }}
    </label>
    <select
      id="language-select"
      v-model="selectedLocale"
      class="language-select"
      :aria-label="t('footer.selectLanguage')"
      @change="handleLocaleChange"
    >
      <option
        v-for="locale in supportedLocales"
        :key="locale"
        :value="locale"
        :selected="locale === currentLocale"
      >
        {{ getLocaleNativeName(locale) }}
      </option>
    </select>

    <!-- Alternative dropdown implementation for better styling -->
    <div v-if="useDropdown" class="language-dropdown" :class="{ 'is-open': isDropdownOpen }">
      <button
        type="button"
        class="language-dropdown__trigger"
        :aria-label="t('footer.selectLanguage')"
        :aria-expanded="isDropdownOpen"
        @click="toggleDropdown"
        @keydown.escape="closeDropdown"
      >
        <span class="language-dropdown__current">
          {{ getLocaleNativeName(currentLocale) }}
        </span>
        <svg
          class="language-dropdown__icon"
          :class="{ 'is-rotated': isDropdownOpen }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4 6l4 4 4-4H4z" />
        </svg>
      </button>

      <ul
        v-show="isDropdownOpen"
        class="language-dropdown__menu"
        role="listbox"
        :aria-label="t('footer.selectLanguage')"
      >
        <li
          v-for="locale in supportedLocales"
          :key="locale"
          class="language-dropdown__item"
          role="option"
          :aria-selected="locale === currentLocale"
          :class="{ 'is-selected': locale === currentLocale }"
        >
          <button type="button" class="language-dropdown__option" @click="selectLocale(locale)">
            {{ getLocaleNativeName(locale) }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { SupportedLocale } from '@/types'

interface Props {
  useDropdown?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  useDropdown: false,
  size: 'medium',
})

const { t, currentLocale, supportedLocales, changeLocale, getLocaleNativeName } = useI18n()

// Local state for select element
const selectedLocale = ref<SupportedLocale>(currentLocale.value)

// Dropdown state
const isDropdownOpen = ref(false)

// Update selected locale when current locale changes
const updateSelectedLocale = () => {
  selectedLocale.value = currentLocale.value
}

// Handle locale change from select element
const handleLocaleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newLocale = target.value as SupportedLocale
  changeLocale(newLocale)
}

// Handle locale selection from dropdown
const selectLocale = (locale: SupportedLocale) => {
  changeLocale(locale)
  closeDropdown()
}

// Dropdown controls
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  const dropdown = target.closest('.language-dropdown')
  if (!dropdown && isDropdownOpen.value) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  updateSelectedLocale()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;

.language-selector {
  position: relative;
  display: inline-block;
}

.language-select {
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius-md;
  background-color: $background-color;
  color: $text-color;
  font-size: $font-size-sm;
  cursor: pointer;
  transition: border-color $transition-normal;

  &:hover {
    border-color: color.adjust($border-color, $lightness: -10%);
  }

  &:focus {
    outline: none;
    border-color: $secondary-color;
    box-shadow: 0 0 0 3px rgba($secondary-color, 0.1);
  }
}

// Screen reader only class
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Dropdown implementation
.language-dropdown {
  position: relative;
  display: inline-block;

  &__trigger {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-color;
    border-radius: $border-radius-md;
    background-color: $background-color;
    color: $text-color;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all $transition-normal;

    &:hover {
      border-color: color.adjust($border-color, $lightness: -10%);
      background-color: $background-light;
    }

    &:focus {
      outline: none;
      border-color: $secondary-color;
      box-shadow: 0 0 0 3px rgba($secondary-color, 0.1);
    }
  }

  &__current {
    font-weight: 500;
  }

  &__icon {
    transition: transform $transition-normal;

    &.is-rotated {
      transform: rotate(180deg);
    }
  }

  &__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 50;
    margin-top: $spacing-xs;
    padding: $spacing-xs 0;
    background-color: $background-color;
    border: 1px solid $border-color;
    border-radius: $border-radius-md;
    box-shadow: $shadow-md;
    list-style: none;
  }

  &__item {
    margin: 0;

    &.is-selected {
      background-color: $background-light;
    }
  }

  &__option {
    display: block;
    width: 100%;
    padding: $spacing-sm $spacing-md;
    text-align: left;
    background: none;
    border: none;
    color: $text-color;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: background-color $transition-normal;

    &:hover {
      background-color: $background-light;
    }

    &:focus {
      outline: none;
      background-color: rgba($secondary-color, 0.1);
    }
  }
}

// Size variants
.language-selector--small {
  .language-select,
  .language-dropdown__trigger {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-xs;
  }
}

.language-selector--large {
  .language-select,
  .language-dropdown__trigger {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-base;
  }
}
</style>
