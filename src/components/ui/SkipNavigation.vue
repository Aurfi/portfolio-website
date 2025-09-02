<template>
  <div class="skip-navigation">
    <a href="#main-content" class="skip-link" @click="focusMainContent">
      {{ $t('accessibility.skipToMain') }}
    </a>
    <a href="#navigation" class="skip-link" @click="focusNavigation">
      {{ $t('accessibility.skipToNavigation') }}
    </a>
  </div>
</template>

<script setup lang="ts">
const focusMainContent = (event: Event) => {
  event.preventDefault()
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.focus()
    mainContent.scrollIntoView({ behavior: 'smooth' })
  }
}

const focusNavigation = (event: Event) => {
  event.preventDefault()
  const navigation = document.querySelector('[role="navigation"]') as HTMLElement
  if (navigation) {
    navigation.focus()
    navigation.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.skip-navigation {
  position: absolute;
  top: -100px;
  left: 0;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: $spacing-sm $spacing-md;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 $border-radius-md 0;
  transform: translateY(-100%);
  transition: transform $transition-normal;

  &:focus {
    transform: translateY(0);
    outline: 2px solid var(--color-background);
    outline-offset: 2px;
  }

  &:not(:first-child) {
    left: 120px;
  }
}

// Ensure skip links are always visible when focused
.skip-link:focus {
  clip: auto !important;
  height: auto !important;
  overflow: visible !important;
  position: absolute !important;
  width: auto !important;
}
</style>
