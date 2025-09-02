<template>
  <footer class="app-footer">
    <div class="app-footer__container">
      <!-- Brand & Contact -->
      <div class="app-footer__section">
        <div class="app-footer__brand">
          <PersonalLogo variant="combined" size="sm" :show-full-name="true" :show-tagline="true" />
        </div>
        <div class="app-footer__contact">
          <a
            href="mailto:john.developer@example.com"
            class="app-footer__email"
            aria-label="Send email to john.developer@example.com"
          >
            john.developer@example.com
          </a>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="app-footer__section">
        <nav class="app-footer__nav" aria-label="Footer navigation">
          <RouterLink to="/" class="app-footer__link" :aria-label="t('navigation.home')">
            {{ t('navigation.home') }}
          </RouterLink>
          <RouterLink
            to="/projects"
            class="app-footer__link"
            :aria-label="t('navigation.projects')"
          >
            {{ t('navigation.projects') }}
          </RouterLink>
          <RouterLink to="/about" class="app-footer__link" :aria-label="t('navigation.about')">
            {{ t('navigation.about') }}
          </RouterLink>
          <RouterLink to="/contact" class="app-footer__link" :aria-label="t('navigation.contact')">
            {{ t('navigation.contact') }}
          </RouterLink>
        </nav>
      </div>

      <!-- Settings & Preferences -->
      <div class="app-footer__section">
        <h3 class="app-footer__title">Preferences</h3>
        <div class="app-footer__settings">
          <div class="app-footer__language">
            <LanguageSelector size="small" />
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="app-footer__bottom">
      <div class="app-footer__container">
        <p class="app-footer__copyright">Built with AI assistance</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import PersonalLogo from '@/components/ui/PersonalLogo.vue'
import LanguageSelector from '@/components/ui/LanguageSelector.vue'

const { t } = useI18n()

</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.app-footer {
  background-color: var(--color-background-light);
  border-top: 1px solid var(--color-border);
  margin-top: auto;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-md;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-2xl;
    align-items: start;

    @media (max-width: #{$breakpoint-md - 1px}) {
      grid-template-columns: 1fr;
      gap: $spacing-xl;
      text-align: center;
    }
  }

  &__section {
    padding: $spacing-2xl 0;

    @media (max-width: #{$breakpoint-md - 1px}) {
      padding: $spacing-md 0;
    }
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: $spacing-md;
  }

  &__brand {
    margin-bottom: $spacing-md;
  }

  &__settings {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  &__email {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    transition: color $transition-normal;

    &:hover,
    &:focus {
      color: var(--color-primary);
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: $border-radius-sm;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    @media (max-width: #{$breakpoint-md - 1px}) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: $spacing-md;
    }
  }

  &__link {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    transition: color $transition-normal;
    padding: $spacing-xs 0;

    &:hover,
    &:focus {
      color: var(--color-primary);
    }

    &:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: $border-radius-sm;
    }

    &.router-link-active {
      color: var(--color-primary);
    }
  }

  &__language {
    display: flex;
    justify-content: flex-start;

    @media (max-width: #{$breakpoint-md - 1px}) {
      justify-content: center;
    }
  }

  &__bottom {
    border-top: 1px solid var(--color-border);
    background-color: var(--color-background-gray);
    padding: $spacing-md 0;
  }

  &__copyright {
    color: var(--color-text-light);
    font-size: $font-size-sm;
    text-align: center;
    margin: 0;
  }

  &__disclaimer {
    color: $text-light;
    font-size: $font-size-xs;
    text-align: center;
    margin: $spacing-xs 0 0 0;
    font-style: italic;
    opacity: 0.8;
  }
}
</style>
