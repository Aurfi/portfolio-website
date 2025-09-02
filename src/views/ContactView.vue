<template>
  <div class="contact-view">
    <div class="container">
      <section class="hero-section">
        <h1>{{ $t('navigation.contact') }}</h1>
        <p class="hero-subtitle">
          {{ $t('contact.subtitle') }}
        </p>
      </section>

      <div class="contact-content">
        <div class="contact-info">
          <h2>{{ $t('contact.getInTouch') }}</h2>
          <p>{{ $t('contact.description') }}</p>

          <div class="contact-methods">
            <div class="contact-method">
              <h3>{{ $t('contact.email') }}</h3>
              <a href="mailto:name.firstname@domain.com" class="contact-link">
                name.firstname@domain.com
              </a>
            </div>

            <div class="contact-method">
              <h3>{{ $t('contact.social') }}</h3>
              <div class="social-links">
                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form-section">
          <h2>{{ $t('contact.sendMessage') }}</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">{{ $t('contact.form.name') }}</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                :placeholder="$t('contact.form.namePlaceholder')"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">{{ $t('contact.form.email') }}</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                :placeholder="$t('contact.form.emailPlaceholder')"
                required
              />
            </div>

            <div class="form-group">
              <label for="subject">{{ $t('contact.form.subject') }}</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                :placeholder="$t('contact.form.subjectPlaceholder')"
                required
              />
            </div>

            <div class="form-group">
              <label for="message">{{ $t('contact.form.message') }}</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                :placeholder="$t('contact.form.messagePlaceholder')"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? $t('contact.form.sending') : $t('contact.form.send') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    // TODO: Implement actual form submission logic
    // For now, just simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: '',
    })

    alert('Message sent successfully!') // Replace with proper notification
  } catch (error) {
    console.error('Error sending message:', error)
    alert('Failed to send message. Please try again.') // Replace with proper error handling
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.contact-view {
  min-height: 100vh;
  padding-top: $spacing-3xl;
}

.hero-section {
  text-align: center;
  margin-bottom: $spacing-3xl;

  h1 {
    font-size: $font-size-4xl;
    margin-bottom: $spacing-md;
    color: $primary-color;
  }

  .hero-subtitle {
    font-size: $font-size-lg;
    color: $text-light;
    max-width: 600px;
    margin: 0 auto;
  }
}

.contact-content {
  display: grid;
  gap: $spacing-3xl;

  @include respond-to(lg) {
    grid-template-columns: 1fr 1fr;
    gap: $spacing-2xl;
  }
}

.contact-info {
  h2 {
    margin-bottom: $spacing-md;
    color: $primary-color;
  }

  p {
    margin-bottom: $spacing-lg;
    color: $text-light;
    line-height: 1.6;
  }
}

.contact-methods {
  display: grid;
  gap: $spacing-lg;
}

.contact-method {
  h3 {
    font-size: $font-size-lg;
    margin-bottom: $spacing-sm;
    color: $primary-color;
  }

  .contact-link {
    color: $secondary-color;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.social-links {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;

  .social-link {
    color: $secondary-color;
    text-decoration: none;
    font-weight: 500;
    padding: $spacing-xs $spacing-sm;
    border: 1px solid $secondary-color;
    border-radius: $border-radius-md;
    transition: all $transition-normal;

    &:hover {
      background-color: $secondary-color;
      color: white;
    }
  }
}

.contact-form-section {
  h2 {
    margin-bottom: $spacing-lg;
    color: $primary-color;
  }
}

.contact-form {
  display: grid;
  gap: $spacing-lg;

  .form-group {
    display: grid;
    gap: $spacing-xs;

    label {
      font-weight: 500;
      color: $text-color;
    }

    input,
    textarea {
      padding: $spacing-sm;
      border: 1px solid $border-color;
      border-radius: $border-radius-md;
      font-family: $font-family-primary;
      font-size: $font-size-base;
      transition: border-color $transition-normal;

      &:focus {
        outline: none;
        border-color: $secondary-color;
      }

      &::placeholder {
        color: $text-light;
      }
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }
  }

  .btn {
    @include button-primary;
    justify-self: start;
    padding: $spacing-sm $spacing-lg;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
