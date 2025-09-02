<template>
  <div class="lazy-image-container" :class="{ loaded: isLoaded, error: hasError }">
    <!-- Placeholder while loading -->
    <div v-if="!isLoaded && !hasError" class="placeholder" :style="placeholderStyle">
      <div class="loading-spinner" v-if="showSpinner">
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Actual image -->
    <img
      v-show="isLoaded"
      ref="imageRef"
      :src="currentSrc"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      :class="imageClass"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Error state -->
    <div v-if="hasError" class="error-placeholder" :style="placeholderStyle">
      <div class="error-content">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span class="error-text">{{ errorText || 'Failed to load image' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  src: string
  alt: string
  placeholder?: string
  width?: number | string
  height?: number | string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  class?: string
  showSpinner?: boolean
  errorText?: string
  threshold?: number
  rootMargin?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  decoding: 'async',
  showSpinner: true,
  threshold: 0.1,
  rootMargin: '50px',
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const hasError = ref(false)
const isIntersecting = ref(false)

// Compute current src based on intersection
const currentSrc = computed(() => {
  return isIntersecting.value || props.loading === 'eager' ? props.src : ''
})

// Compute image classes
const imageClass = computed(() => {
  const classes = ['lazy-image']
  if (props.class) {
    classes.push(props.class)
  }
  return classes.join(' ')
})

// Compute placeholder style
const placeholderStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  if (props.placeholder) {
    style.backgroundImage = `url(${props.placeholder})`
  }

  return style
})

// Intersection Observer for lazy loading
let observer: IntersectionObserver | null = null

const handleLoad = (event: Event) => {
  isLoaded.value = true
  hasError.value = false
  emit('load', event)
}

const handleError = (event: Event) => {
  hasError.value = true
  isLoaded.value = false
  emit('error', event)
}

const setupIntersectionObserver = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback for environments without IntersectionObserver
    isIntersecting.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isIntersecting.value = true
          observer?.unobserve(entry.target)
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin,
    }
  )

  if (imageRef.value) {
    observer.observe(imageRef.value)
  }
}

// Watch for src changes to reset state
watch(
  () => props.src,
  () => {
    isLoaded.value = false
    hasError.value = false
  }
)

onMounted(() => {
  if (props.loading === 'lazy') {
    setupIntersectionObserver()
  } else {
    isIntersecting.value = true
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.lazy-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  transition: all 0.3s ease;

  &.loaded {
    .placeholder {
      opacity: 0;
      pointer-events: none;
    }
  }

  &.error {
    .placeholder {
      display: none;
    }
  }
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-background-soft);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  z-index: 1;

  // Subtle gradient overlay for better contrast
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(0, 0, 0, 0.05) 100%
    );
    z-index: -1;
  }
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-soft);
  color: var(--color-text-muted);
  min-height: 200px;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 20px;
}

.error-icon {
  width: 48px;
  height: 48px;
  opacity: 0.6;
}

.error-text {
  font-size: 14px;
  opacity: 0.8;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;

  // Optimize image rendering
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;

  // Prevent layout shift
  display: block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// Dark theme adjustments
@media (prefers-color-scheme: dark) {
  .placeholder {
    background-color: var(--color-background-mute);
  }

  .error-placeholder {
    background-color: var(--color-background-mute);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .lazy-image-container,
  .placeholder,
  .lazy-image {
    transition: none;
  }

  .spinner {
    animation: none;
  }
}
</style>
