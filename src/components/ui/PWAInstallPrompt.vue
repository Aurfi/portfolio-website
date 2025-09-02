<template>
  <Transition name="slide-up" appear>
    <div
      v-if="showPrompt"
      class="pwa-install-prompt"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-description"
    >
      <div class="prompt-content">
        <div class="prompt-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>

        <div class="prompt-text">
          <h3 id="pwa-install-title">{{ $t('pwa.install.title') }}</h3>
          <p id="pwa-install-description">{{ $t('pwa.install.description') }}</p>
        </div>

        <div class="prompt-actions">
          <BaseButton
            variant="secondary"
            size="small"
            @click="dismissPrompt"
            :aria-label="$t('pwa.install.dismiss')"
          >
            {{ $t('pwa.install.dismiss') }}
          </BaseButton>

          <BaseButton
            variant="primary"
            size="small"
            @click="installApp"
            :loading="installing"
            :aria-label="$t('pwa.install.install')"
          >
            {{ $t('pwa.install.install') }}
          </BaseButton>
        </div>
      </div>

      <button class="close-button" @click="dismissPrompt" :aria-label="$t('common.close')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseButton from './BaseButton.vue'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const emit = defineEmits<{
  installed: []
  dismissed: []
}>()

const isInstallable = ref(false)
const installing = ref(false)
const isDismissed = ref(false)

let deferredPrompt: BeforeInstallPromptEvent | null = null

const showPrompt = computed(() => {
  return isInstallable.value && !isDismissed.value && !isInstalled.value
})

const isInstalled = computed(() => {
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isIOSStandalone = (window.navigator as any).standalone === true
  return isStandalone || isIOSStandalone
})

const installApp = async () => {
  if (!deferredPrompt) return

  installing.value = true

  try {
    await deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === 'accepted') {
      console.log('PWA installation accepted')
      emit('installed')
    } else {
      console.log('PWA installation dismissed')
      emit('dismissed')
    }

    deferredPrompt = null
    isInstallable.value = false
  } catch (error) {
    console.error('PWA installation failed:', error)
  } finally {
    installing.value = false
  }
}

const dismissPrompt = () => {
  isDismissed.value = true
  emit('dismissed')

  // Remember dismissal for this session
  sessionStorage.setItem('pwa-prompt-dismissed', 'true')
}

const handleBeforeInstallPrompt = (event: Event) => {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent

  // Check if user has already dismissed this session
  const wasDismissed = sessionStorage.getItem('pwa-prompt-dismissed')
  if (!wasDismissed) {
    isInstallable.value = true
  }
}

const handleAppInstalled = () => {
  console.log('PWA was installed')
  isInstallable.value = false
  deferredPrompt = null
  emit('installed')
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.pwa-install-prompt {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 400px;
  margin: 0 auto;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  z-index: 1000;

  @media (min-width: 768px) {
    left: auto;
    right: 20px;
    margin: 0;
  }
}

.prompt-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  padding-right: 50px; // Space for close button
}

.prompt-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 20px;
    height: 20px;
  }
}

.prompt-text {
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--color-heading);
    line-height: 1.3;
  }

  p {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: var(--color-text);
    line-height: 1.4;
  }
}

.prompt-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  :deep(.base-button) {
    font-size: 14px;
    padding: 8px 16px;
  }
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-background-soft);
    color: var(--color-text);
  }

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
}

// Transitions
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

// Dark theme adjustments
@media (prefers-color-scheme: dark) {
  .pwa-install-prompt {
    box-shadow:
      0 10px 25px rgba(0, 0, 0, 0.3),
      0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: opacity 0.2s ease;
  }

  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: none;
  }
}

// Mobile optimizations
@media (max-width: 480px) {
  .pwa-install-prompt {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }

  .prompt-content {
    padding: 16px;
    padding-right: 40px;
  }

  .prompt-actions {
    flex-direction: column;

    :deep(.base-button) {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
