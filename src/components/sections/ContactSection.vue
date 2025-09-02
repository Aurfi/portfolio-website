<template>
  <section class="contact-section section" :id="id" aria-labelledby="contact-title">
    <div class="container">
      <div class="contact-content">
        <div class="contact-info">
          <div class="section-header">
            <h2 id="contact-title" class="section-title">{{ $t('contact.title') }}</h2>
            <p class="section-subtitle">{{ $t('contact.subtitle') }}</p>
          </div>

          <div class="contact-methods">
            <div class="contact-method">
              <div class="method-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  ></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="method-content">
                <h3 class="method-title">{{ $t('contact.email') }}</h3>
                <p class="method-description">{{ $t('contact.emailDescription') }}</p>
              </div>
            </div>

            <div class="contact-method">
              <div class="method-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                  ></path>
                </svg>
              </div>
              <div class="method-content">
                <h3 class="method-title">{{ $t('contact.phone') }}</h3>
                <p class="method-description">{{ $t('contact.phoneDescription') }}</p>
              </div>
            </div>

            <div class="contact-method">
              <div class="method-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="method-content">
                <h3 class="method-title">{{ $t('contact.location') }}</h3>
                <p class="method-description">{{ $t('contact.locationDescription') }}</p>
              </div>
            </div>
          </div>

          <div class="social-links">
            <h3 class="social-title">{{ $t('contact.followMe') }}</h3>
            <div class="social-icons">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                :aria-label="social.name"
                class="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <component :is="social.icon" />
              </a>
            </div>
          </div>
        </div>

        <div class="contact-form-container">
          <form
            class="contact-form"
            @submit.prevent="submitForm"
            role="form"
            aria-labelledby="contact-form-title"
            novalidate
          >
            <h3 id="contact-form-title" class="sr-only">Contact Form</h3>
            <div class="form-group">
              <label for="name" class="form-label">{{ $t('contact.form.name') }}</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-input"
                :class="{ error: errors.name }"
                :placeholder="$t('contact.form.namePlaceholder')"
                :aria-describedby="errors.name ? 'name-error' : undefined"
                :aria-invalid="!!errors.name"
                required
                autocomplete="name"
              />
              <span v-if="errors.name" id="name-error" class="error-message" role="alert">{{
                errors.name
              }}</span>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">{{ $t('contact.form.email') }}</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ error: errors.email }"
                :placeholder="$t('contact.form.emailPlaceholder')"
                :aria-describedby="errors.email ? 'email-error' : undefined"
                :aria-invalid="!!errors.email"
                required
                autocomplete="email"
              />
              <span v-if="errors.email" id="email-error" class="error-message" role="alert">{{
                errors.email
              }}</span>
            </div>

            <div class="form-group">
              <label for="subject" class="form-label">{{ $t('contact.form.subject') }}</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                class="form-input"
                :class="{ error: errors.subject }"
                :placeholder="$t('contact.form.subjectPlaceholder')"
                :aria-describedby="errors.subject ? 'subject-error' : undefined"
                :aria-invalid="!!errors.subject"
                required
                autocomplete="off"
              />
              <span v-if="errors.subject" id="subject-error" class="error-message" role="alert">{{
                errors.subject
              }}</span>
            </div>

            <div class="form-group">
              <label for="message" class="form-label">{{ $t('contact.form.message') }}</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-textarea"
                :class="{ error: errors.message }"
                :placeholder="$t('contact.form.messagePlaceholder')"
                :aria-describedby="errors.message ? 'message-error' : undefined"
                :aria-invalid="!!errors.message"
                rows="5"
                required
                autocomplete="off"
              ></textarea>
              <span v-if="errors.message" id="message-error" class="error-message" role="alert">{{
                errors.message
              }}</span>
            </div>

            <!-- Honeypot field for spam protection -->
            <input
              v-model="form.honeypot"
              type="text"
              class="honeypot"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
            />

            <button
              type="submit"
              class="submit-button"
              :disabled="isSubmitting"
              :class="{ loading: isSubmitting }"
            >
              <span v-if="!isSubmitting">{{ $t('contact.form.submit') }}</span>
              <span v-else>{{ $t('contact.form.submitting') }}</span>

              <svg
                v-if="!isSubmitting"
                class="submit-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>

              <div v-else class="loading-spinner"></div>
            </button>
          </form>

          <!-- Success/Error Messages -->
          <div
            v-if="submitStatus"
            class="submit-status"
            :class="submitStatus.type"
            role="alert"
            aria-live="polite"
          >
            <div class="status-icon" aria-hidden="true">
              <svg
                v-if="submitStatus.type === 'success'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <p class="status-message">{{ submitStatus.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAccessibility } from '@/composables/useAccessibility'

interface Props {
  id: string
}

defineProps<Props>()

const { t } = useI18n()
const { announce } = useAccessibility()

// Form data
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  honeypot: '', // Spam protection
})

// Form validation
const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

// Form state
const isSubmitting = ref(false)
const submitStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

// Social links
const socialLinks = computed(() => [
  {
    name: 'GitHub',
    url: 'https://github.com/username',
    icon: 'GitHubIcon',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/username',
    icon: 'LinkedInIcon',
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/username',
    icon: 'TwitterIcon',
  },
])

// Form validation
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true
  const errorMessages: string[] = []

  // Name validation
  if (!form.name.trim()) {
    errors.name = t('contact.form.errors.nameRequired')
    errorMessages.push('Name is required')
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = t('contact.form.errors.nameMinLength')
    errorMessages.push('Name must be at least 2 characters')
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = t('contact.form.errors.emailRequired')
    errorMessages.push('Email is required')
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = t('contact.form.errors.emailInvalid')
    errorMessages.push('Please enter a valid email address')
    isValid = false
  }

  // Subject validation
  if (!form.subject.trim()) {
    errors.subject = t('contact.form.errors.subjectRequired')
    errorMessages.push('Subject is required')
    isValid = false
  }

  // Message validation
  if (!form.message.trim()) {
    errors.message = t('contact.form.errors.messageRequired')
    errorMessages.push('Message is required')
    isValid = false
  } else if (form.message.trim().length < 10) {
    errors.message = t('contact.form.errors.messageMinLength')
    errorMessages.push('Message must be at least 10 characters')
    isValid = false
  }

  // Announce validation errors to screen readers
  if (!isValid) {
    const errorCount = errorMessages.length
    announce(
      `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. ${errorMessages.join('. ')}`,
      'assertive'
    )
  }

  return isValid
}

// Form submission
const submitForm = async () => {
  // Check honeypot for spam
  if (form.honeypot) {
    return // Likely spam, silently ignore
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  submitStatus.value = null

  try {
    // TODO: Implement actual form submission
    // For now, simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate success
    submitStatus.value = {
      type: 'success',
      message: t('contact.form.success'),
    }

    // Announce success to screen readers
    announce('Message sent successfully! I will get back to you soon.', 'polite')

    // Reset form
    Object.keys(form).forEach((key) => {
      form[key as keyof typeof form] = ''
    })
  } catch (error) {
    submitStatus.value = {
      type: 'error',
      message: t('contact.form.error'),
    }

    // Announce error to screen readers
    announce('There was an error sending your message. Please try again.', 'assertive')
  } finally {
    isSubmitting.value = false

    // Clear status after 5 seconds
    setTimeout(() => {
      submitStatus.value = null
    }, 5000)
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.contact-section {
  padding: $spacing-xxl 0;
  background: rgba($background-color, 0.5);
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xxl;

  @include respond-to(lg) {
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xxxl;
  }
}

.section-header {
  margin-bottom: $spacing-xl;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: $text-color;
  margin-bottom: $spacing-md;
}

.section-subtitle {
  font-size: $font-size-lg;
  color: $text-color-light;
  line-height: 1.6;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;
}

.contact-method {
  display: flex;
  gap: $spacing-md;
  align-items: flex-start;
}

.method-icon {
  width: 48px;
  height: 48px;
  background: rgba($primary-color, 0.1);
  border-radius: $border-radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
}

.method-content {
  .method-title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }

  .method-description {
    color: $text-color-light;
    line-height: 1.6;
  }
}

.social-links {
  .social-title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-md;
  }
}

.social-icons {
  display: flex;
  gap: $spacing-md;
}

.social-link {
  width: 48px;
  height: 48px;
  background: rgba($primary-color, 0.1);
  border-radius: $border-radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  text-decoration: none;
  transition: all $transition-normal;

  &:hover {
    background: $primary-color;
    color: white;
    transform: translateY(-2px);
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

.contact-form-container {
  background: white;
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.form-label {
  font-weight: 600;
  color: $text-color;
  font-size: $font-size-sm;
}

.form-input,
.form-textarea {
  padding: $spacing-md;
  border: 2px solid $border-color;
  border-radius: $border-radius-md;
  font-size: $font-size-base;
  transition: all $transition-normal;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
  }

  &.error {
    border-color: $error-color;
  }

  &::placeholder {
    color: $text-color-light;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.error-message {
  color: $error-color;
  font-size: $font-size-sm;
  margin-top: $spacing-xs;
}

.honeypot {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  background: $primary-color;
  color: white;
  border: none;
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-md;
  font-weight: 600;
  font-size: $font-size-base;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover:not(:disabled) {
    background: color.scale($primary-color, $lightness: -41.1290322581%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($primary-color, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &.loading {
    pointer-events: none;
  }
}

.submit-icon {
  width: 18px;
  height: 18px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(white, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.submit-status {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-radius: $border-radius-md;
  margin-top: $spacing-lg;

  &.success {
    background: rgba($success-color, 0.1);
    color: $success-color;
    border: 1px solid rgba($success-color, 0.2);
  }

  &.error {
    background: rgba($error-color, 0.1);
    color: $error-color;
    border: 1px solid rgba($error-color, 0.2);
  }
}

.status-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
}

.status-message {
  font-weight: 500;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
