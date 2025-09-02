<template>
  <div class="projects-view">
    <div class="container">
      <section class="hero-section" :class="{ 'fade-in': isLoaded }">
        <h1>{{ $t('projects.title') }}</h1>
        <p class="hero-subtitle">
          {{ $t('projects.subtitle') }}
        </p>
      </section>

      <div class="grid-container" :class="{ 'fade-in': isLoaded }">
        <ProjectsGrid />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectsGrid from '@/components/projects/ProjectsGrid.vue'

const isLoaded = ref(false)

onMounted(() => {
  // Ensure we start at the top
  window.scrollTo(0, 0)
  
  // Trigger animations after a short delay
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})
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
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }

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

.grid-container {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out 0.2s;

  &.fade-in {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
