<template>
  <div class="not-found-view">
    <div class="container">
      <div class="error-content">
        <div class="error-code">404</div>
        <h1>{{ $t('notFound.title') }}</h1>
        <p class="error-message">
          {{ $t('notFound.message') }}
        </p>

        <div class="error-actions">
          <router-link to="/" class="btn btn-primary">
            {{ $t('notFound.goHome') }}
          </router-link>
          <router-link to="/projects" class="btn btn-secondary">
            {{ $t('notFound.viewProjects') }}
          </router-link>
        </div>

        <div class="helpful-links">
          <h3>{{ $t('notFound.helpfulLinks') }}</h3>
          <ul>
            <li>
              <router-link to="/">{{ $t('navigation.home') }}</router-link>
            </li>
            <li>
              <router-link to="/projects">{{ $t('navigation.projects') }}</router-link>
            </li>
            <li>
              <router-link to="/about">{{ $t('navigation.about') }}</router-link>
            </li>
            <li>
              <router-link to="/contact">{{ $t('navigation.contact') }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for 404 page
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.not-found-view {
  min-height: 100vh;
  @include flex-center;
  padding: $spacing-lg;
}

.error-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: $secondary-color;
  line-height: 1;
  margin-bottom: $spacing-md;

  @include respond-to(md) {
    font-size: 12rem;
  }
}

h1 {
  font-size: $font-size-3xl;
  margin-bottom: $spacing-md;
  color: $primary-color;

  @include respond-to(md) {
    font-size: $font-size-4xl;
  }
}

.error-message {
  font-size: $font-size-lg;
  color: $text-light;
  margin-bottom: $spacing-2xl;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: $spacing-3xl;

  .btn {
    @include button-base;
    padding: $spacing-sm $spacing-lg;

    &.btn-primary {
      @include button-primary;
    }

    &.btn-secondary {
      @include button-secondary;
    }
  }
}

.helpful-links {
  h3 {
    font-size: $font-size-lg;
    margin-bottom: $spacing-md;
    color: $primary-color;
  }

  ul {
    list-style: none;
    padding: 0;
    display: grid;
    gap: $spacing-sm;

    @include respond-to(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    li {
      a {
        color: $secondary-color;
        text-decoration: none;
        font-weight: 500;
        padding: $spacing-xs $spacing-sm;
        border-radius: $border-radius-md;
        transition: all $transition-normal;

        &:hover {
          background-color: $secondary-color;
          color: white;
        }
      }
    }
  }
}
</style>
