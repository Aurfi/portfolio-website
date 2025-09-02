<template>
  <section class="projects-section section" :id="id">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ $t('projects.title') }}</h2>
        <p class="section-subtitle">{{ $t('projects.subtitle') }}</p>
      </div>

      <div class="projects-grid">
        <div
          v-for="project in featuredProjects"
          :key="project.id"
          class="project-card"
          @click="viewProject(project)"
        >
          <div class="project-image">
            <img :src="project.image" :alt="project.title" loading="lazy" />
            <div class="project-overlay">
              <button class="view-button">
                {{ $t('projects.viewProject') }}
              </button>
            </div>
          </div>

          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>

            <div class="project-tech">
              <span v-for="tech in project.technologies" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="section-actions">
        <router-link to="/projects" class="view-all-button">
          {{ $t('projects.viewAll') }}
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

interface Props {
  id: string
}

defineProps<Props>()

const router = useRouter()

// Mock featured projects data
const featuredProjects = computed(() => [
  {
    id: 'business-app',
    title: 'Enterprise Business Application',
    description:
      'A comprehensive business management system with microservices architecture, featuring order management, inventory tracking, and analytics dashboard.',
    image: '/images/projects/business-app.svg',
    technologies: ['Spring Boot', 'Vue.js', 'PostgreSQL', 'Docker', 'Redis'],
  },
  {
    id: 'frontend-showcase',
    title: 'Modern Frontend Showcase',
    description:
      'An interactive demonstration of advanced Vue.js patterns, component libraries, and real-time features with elegant animations.',
    image: '/images/projects/frontend-showcase.svg',
    technologies: ['Vue.js 3', 'TypeScript', 'Pinia', 'WebSocket', 'SCSS'],
  },
  {
    id: 'mobile-pwa',
    title: 'Progressive Web Application',
    description:
      'A mobile-first PWA with offline capabilities, push notifications, and native-like user experience for food ordering.',
    image: '/images/projects/mobile-pwa.svg',
    technologies: ['PWA', 'Hono.js', 'IndexedDB', 'Service Worker', 'WebPush'],
  },
])

const viewProject = (project: any) => {
  router.push(`/projects/${project.id}`)
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.projects-section {
  background: rgba($background-color, 0.5);
  padding: $spacing-xxl 0;
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-md;
  }
}

.section-header {
  text-align: center;
  margin-bottom: $spacing-xxl;
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
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;
  margin-bottom: $spacing-xxl;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.project-card {
  background: white;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all $transition-normal;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);

    .project-overlay {
      opacity: 1;
    }

    .project-image img {
      transform: scale(1.05);
    }
  }
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-normal;
  }
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($primary-color, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity $transition-normal;
}

.view-button {
  background: white;
  color: $primary-color;
  border: none;
  padding: $spacing-sm $spacing-lg;
  border-radius: $border-radius-md;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
}

.project-content {
  padding: $spacing-lg;
}

.project-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-color;
  margin-bottom: $spacing-sm;
  line-height: 1.3;
}

.project-description {
  color: $text-color-light;
  line-height: 1.6;
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
}

.tech-tag {
  background: rgba($primary-color, 0.1);
  color: $primary-color;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-size: $font-size-xs;
  font-weight: 500;
}

.section-actions {
  text-align: center;
}

.view-all-button {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  background: $primary-color;
  color: white;
  text-decoration: none;
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-lg;
  font-weight: 600;
  transition: all $transition-normal;

  &:hover {
    background: color.adjust($primary-color, $lightness: -10%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($primary-color, 0.3);

    .arrow-icon {
      transform: translateX(4px);
    }
  }
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform $transition-normal;
}

// Placeholder images for development
.project-image img[src*='placeholder'] {
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}
</style>
