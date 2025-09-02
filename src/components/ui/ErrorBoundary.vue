<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">{{ title }}</h2>
      <p class="error-message">{{ errorMessage }}</p>

      <div class="error-actions">
        <button @click="retry" class="retry-button" v-if="retryable">Try Again</button>
        <button @click="reset" class="reset-button">Reset</button>
        <button @click="goHome" class="home-button">Go Home</button>
      </div>

      <details v-if="showDetails" class="error-details">
        <summary>Technical Details</summary>
        <pre>{{ errorStack }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import {
  useErrorHandler,
  ErrorSeverity,
  ErrorCategory,
} from '@/composables/useErrorHandler'

interface Props {
  title?: string
  fallback?: boolean
  retryable?: boolean
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  fallback: true,
  retryable: true,
  showDetails: import.meta.env.DEV,
})

const emit = defineEmits<{
  error: [error: Error]
  retry: []
  reset: []
}>()

const router = useRouter()
const { handle } = useErrorHandler()

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const currentError = ref<Error | null>(null)

onErrorCaptured((error: Error) => {
  hasError.value = true
  errorMessage.value = error.message || 'An unexpected error occurred'
  errorStack.value = error.stack || ''
  currentError.value = error

  // Log error to error handler
  handle(error, {
    category: ErrorCategory.CLIENT,
    severity: ErrorSeverity.HIGH,
    additional: {
      component: 'ErrorBoundary',
      fallback: props.fallback,
    },
  })

  emit('error', error)

  // Prevent error from propagating if fallback is enabled
  return props.fallback
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  currentError.value = null
  emit('retry')
}

const reset = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  currentError.value = null
  emit('reset')
}

const goHome = () => {
  router.push('/')
  reset()
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.error-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
  padding: 3rem;
  background: var(--bg-primary);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: shake 0.5s ease-in-out;
}

.error-title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
  }

  .retry-button {
    background: var(--color-primary);
    color: white;
  }

  .reset-button {
    background: var(--color-secondary);
    color: white;
  }

  .home-button {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
}

.error-details {
  text-align: left;
  margin-top: 2rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;

    &:hover {
      color: var(--color-primary);
    }
  }

  pre {
    overflow-x: auto;
    padding: 1rem;
    background: var(--bg-primary);
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    white-space: pre-wrap;
    word-break: break-word;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

@media (max-width: 640px) {
  .error-container {
    padding: 2rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>
