<template>
  <div class="projects-view">
    <div class="container">
      <section class="hero-section">
        <h1>{{ $t('projects.title') }}</h1>
        <p class="hero-subtitle">
          {{ $t('projects.subtitle') }}
        </p>
      </section>

      <ProjectsGrid />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectsGrid from '@/components/projects/ProjectsGrid.vue'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.projects-view {
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
</style>
