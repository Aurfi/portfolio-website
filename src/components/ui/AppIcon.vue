<template>
  <component
    :is="iconComponent"
    :class="[
      'app-icon',
      `app-icon--${size}`,
      { 'app-icon--solid': solid }
    ]"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue'

interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  solid?: boolean
}

defineProps<Props>()

// Create a simple SVG fallback component
const FallbackIcon = defineComponent({
  name: 'FallbackIcon',
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  `
})

const iconComponent = computed(() => {
  // For now, return the fallback icon until we can properly load HeroIcons
  // This prevents the initialization error
  return FallbackIcon
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.app-icon {
  display: inline-block;
  flex-shrink: 0;
  
  &--xs {
    width: 1rem;
    height: 1rem;
  }
  
  &--sm {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  &--md {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  &--lg {
    width: 2rem;
    height: 2rem;
  }
  
  &--xl {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>