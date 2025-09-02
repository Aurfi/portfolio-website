<template>
  <Teleport to="body">
    <div
      class="modal-overlay"
      @click="$emit('close')"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="modalTitleId"
      aria-describedby="modal-description"
    >
      <div class="modal-container" @click.stop>
        <!-- Modal Header -->
        <header class="modal-header">
          <div class="header-content">
            <div class="project-category" :style="{ color: project.category.color }">
              {{ project.category.name.en }}
            </div>
            <h2 :id="modalTitleId" class="project-title">{{ project.title.en }}</h2>
            <div class="project-meta">
              <span class="completion-date">
                {{ $t('projects.completed') }}: {{ formatDate(project.completionDate) }}
              </span>
              <span class="development-duration">
                {{ $t('projects.duration') }}: {{ project.developmentDuration }}
              </span>
            </div>
          </div>
          <button
            class="close-button"
            @click="$emit('close')"
            :aria-label="$t('common.close')"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <!-- Modal Content -->
        <div class="modal-content">
          <!-- Project Screenshots -->
          <section class="screenshots-section">
            <div class="screenshot-gallery">
              <div class="main-screenshot">
                <img
                  :src="selectedScreenshot || project.screenshots[0] || placeholderImage"
                  :alt="`Screenshot of ${project.title.en} showing the main interface`"
                  @error="handleImageError"
                />
              </div>
              <div v-if="project.screenshots.length > 1" class="screenshot-thumbnails">
                <button
                  v-for="(screenshot, index) in project.screenshots"
                  :key="index"
                  :class="['thumbnail', { active: selectedScreenshot === screenshot }]"
                  @click="selectedScreenshot = screenshot"
                  :aria-label="`View screenshot ${index + 1} of ${project.title.en}`"
                  type="button"
                >
                  <img :src="screenshot" :alt="`Screenshot ${index + 1} of ${project.title.en}`" />
                </button>
              </div>
            </div>
          </section>

          <!-- Project Information -->
          <section class="project-info">
            <!-- Description -->
            <div class="info-section">
              <h3>{{ $t('projects.about') }}</h3>
              <p class="project-description">{{ project.description.en }}</p>
            </div>

            <!-- Key Highlights -->
            <div class="info-section">
              <h3>{{ $t('projects.highlights') }}</h3>
              <ul class="highlights-list">
                <li
                  v-for="highlight in project.highlights.en"
                  :key="highlight"
                  class="highlight-item"
                >
                  <span class="highlight-icon">✓</span>
                  <span class="highlight-text">{{ highlight }}</span>
                </li>
              </ul>
            </div>

            <!-- Technologies Used -->
            <div class="info-section">
              <h3>{{ $t('projects.technologies') }}</h3>
              <div class="technology-grid">
                <span v-for="tech in project.technologies" :key="tech" class="tech-badge">
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Complexity & Metrics -->
            <div class="info-section">
              <h3>{{ $t('projects.complexity') }}</h3>
              <div class="complexity-info">
                <div class="complexity-level">
                  <span class="complexity-badge" :class="`complexity-${project.complexity.level}`">
                    {{ getComplexityLabel(project.complexity.level) }}
                  </span>
                  <span class="complexity-description">
                    {{ getComplexityDescription(project.complexity.level) }}
                  </span>
                </div>

                <div class="complexity-indicators">
                  <h4>{{ $t('projects.keyIndicators') }}</h4>
                  <ul class="indicators-list">
                    <li v-for="indicator in project.complexity.indicators" :key="indicator">
                      {{ indicator }}
                    </li>
                  </ul>
                </div>

                <div
                  v-if="project.complexity.linesOfCode || project.complexity.teamSize"
                  class="project-metrics"
                >
                  <div v-if="project.complexity.linesOfCode" class="metric">
                    <span class="metric-label">{{ $t('projects.linesOfCode') }}:</span>
                    <span class="metric-value">{{
                      formatNumber(project.complexity.linesOfCode)
                    }}</span>
                  </div>
                  <div v-if="project.complexity.teamSize" class="metric">
                    <span class="metric-label">{{ $t('projects.teamSize') }}:</span>
                    <span class="metric-value"
                      >{{ project.complexity.teamSize }}
                      {{ $t('projects.developer', project.complexity.teamSize) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Modal Footer -->
        <footer class="modal-footer">
          <div class="project-actions">
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="action-button primary"
            >
              <span class="button-icon">🚀</span>
              {{ $t('projects.viewDemo') }}
            </a>
            <a
              v-if="project.repositoryUrl"
              :href="project.repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="action-button secondary"
            >
              <span class="button-icon">📂</span>
              {{ $t('projects.viewCode') }}
            </a>
          </div>

          <div class="project-status">
            <div class="status-item">
              <span class="status-icon">{{ project.isExternal ? '🌐' : '🔗' }}</span>
              <span class="status-text">
                {{ project.isExternal ? $t('projects.external') : $t('projects.integrated') }}
              </span>
            </div>
            <div v-if="project.featured" class="status-item featured">
              <span class="status-icon">⭐</span>
              <span class="status-text">{{ $t('projects.featured') }}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Project } from '@/types'

interface Props {
  project: Project
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive state
const selectedScreenshot = ref<string>('')

// Computed properties
const modalTitleId = computed(() => `modal-title-${props.project.id}`)

const placeholderImage = computed(() => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6c757d" font-family="Arial, sans-serif" font-size="20">
        ${props.project.title.en}
      </text>
    </svg>
  `)}`
})

// Methods
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = placeholderImage.value
}

const getComplexityLabel = (level: string) => {
  const labels = {
    simple: 'Simple',
    intermediate: 'Intermediate',
    complex: 'Complex',
    enterprise: 'Enterprise',
  }
  return labels[level as keyof typeof labels] || level
}

const getComplexityDescription = (level: string) => {
  const descriptions = {
    simple: 'Straightforward implementation with basic features',
    intermediate: 'Moderate complexity with multiple integrated features',
    complex: 'Advanced architecture with sophisticated functionality',
    enterprise: 'Production-ready system with enterprise-grade features',
  }
  return descriptions[level as keyof typeof descriptions] || ''
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = 'hidden'

  // Set initial screenshot
  if (props.project.screenshots.length > 0) {
    selectedScreenshot.value = props.project.screenshots[0]
  }

  // Focus management - focus the close button initially
  setTimeout(() => {
    const closeButton = document.querySelector('.close-button') as HTMLElement
    closeButton?.focus()
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;
@use 'sass:color';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: $border-radius-xl;
  max-width: 900px;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

// Modal Header
.modal-header {
  @include flex-between;
  padding: $spacing-xl;
  border-bottom: 1px solid $border-color;
  background: $background-light;
}

.header-content {
  flex: 1;
}

.project-category {
  font-size: $font-size-sm;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: $spacing-xs;
}

.project-title {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $text-color;
  margin: 0 0 $spacing-sm 0;
  line-height: 1.2;
}

.project-meta {
  display: flex;
  gap: $spacing-lg;
  font-size: $font-size-sm;
  color: $text-color-light;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    gap: $spacing-xs;
  }
}

.close-button {
  background: none;
  border: none;
  padding: $spacing-sm;
  cursor: pointer;
  color: $text-color-light;
  border-radius: $border-radius-md;
  transition: all $transition-fast;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: rgba($text-color, 0.1);
    color: $text-color;
  }
}

// Modal Content
.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-xl;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-xl;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
    padding: $spacing-lg;
  }
}

// Screenshots Section
.screenshots-section {
  .main-screenshot {
    border-radius: $border-radius-lg;
    overflow: hidden;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-lg;

    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .screenshot-thumbnails {
    display: flex;
    gap: $spacing-sm;
    overflow-x: auto;
    padding-bottom: $spacing-xs;

    .thumbnail {
      flex-shrink: 0;
      width: 80px;
      height: 60px;
      border: 2px solid transparent;
      border-radius: $border-radius-md;
      overflow: hidden;
      cursor: pointer;
      transition: all $transition-fast;
      background: none;
      padding: 0;

      &.active {
        border-color: $secondary-color;
      }

      &:hover {
        border-color: $primary-color;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

// Project Info Section
.project-info {
  .info-section {
    margin-bottom: $spacing-xl;

    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $spacing-md;
      border-bottom: 2px solid $border-color;
      padding-bottom: $spacing-xs;
    }

    h4 {
      font-size: $font-size-md;
      font-weight: 600;
      color: $text-color;
      margin-bottom: $spacing-sm;
    }
  }
}

.project-description {
  color: $text-color;
  line-height: 1.7;
  font-size: $font-size-md;
}

// Highlights
.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;

  .highlight-item {
    display: flex;
    align-items: flex-start;
    gap: $spacing-sm;
    margin-bottom: $spacing-sm;
    padding: $spacing-sm;
    background: rgba($success-color, 0.05);
    border-radius: $border-radius-md;
    border-left: 3px solid $success-color;

    .highlight-icon {
      color: $success-color;
      font-weight: 600;
      flex-shrink: 0;
    }

    .highlight-text {
      color: $text-color;
      line-height: 1.5;
    }
  }
}

// Technology Grid
.technology-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: $spacing-sm;

  .tech-badge {
    background: $primary-color;
    color: white;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-md;
    font-size: $font-size-sm;
    font-weight: 500;
    text-align: center;
    transition: all $transition-fast;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

// Complexity Info
.complexity-info {
  .complexity-level {
    @include flex-between;
    align-items: flex-start;
    margin-bottom: $spacing-lg;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }

  .complexity-badge {
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-md;
    font-size: $font-size-sm;
    font-weight: 600;
    color: white;

    &.complexity-simple {
      background: $success-color;
    }

    &.complexity-intermediate {
      background: $warning-color;
    }

    &.complexity-complex {
      background: $secondary-color;
    }

    &.complexity-enterprise {
      background: $accent-color;
    }
  }

  .complexity-description {
    color: $text-color-light;
    font-style: italic;
    flex: 1;
    min-width: 200px;
  }

  .complexity-indicators {
    margin-bottom: $spacing-lg;
  }

  .indicators-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-xs;

    li {
      padding: $spacing-xs $spacing-sm;
      background: rgba($secondary-color, 0.1);
      border-radius: $border-radius-sm;
      color: $text-color;
      font-size: $font-size-sm;
    }
  }

  .project-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: $spacing-md;

    .metric {
      padding: $spacing-md;
      background: $background-light;
      border-radius: $border-radius-md;
      text-align: center;

      .metric-label {
        display: block;
        font-size: $font-size-sm;
        color: $text-color-light;
        margin-bottom: $spacing-xs;
      }

      .metric-value {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $text-color;
      }
    }
  }
}

// Modal Footer
.modal-footer {
  @include flex-between;
  padding: $spacing-xl;
  border-top: 1px solid $border-color;
  background: $background-light;
  flex-wrap: wrap;
  gap: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    align-items: stretch;
  }
}

.project-actions {
  display: flex;
  gap: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    justify-content: center;
  }
}

.action-button {
  @include button-base;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-weight: 600;

  &.primary {
    background: $primary-color;
    color: white;

    &:hover {
      background: color.adjust($primary-color, $lightness: -10%);
      transform: translateY(-1px);
    }
  }

  &.secondary {
    background: transparent;
    color: $primary-color;
    border: 2px solid $primary-color;

    &:hover {
      background: $primary-color;
      color: white;
    }
  }

  .button-icon {
    font-size: $font-size-md;
  }
}

.project-status {
  display: flex;
  gap: $spacing-md;
  align-items: center;

  @media (max-width: $breakpoint-sm) {
    justify-content: center;
  }
}

.status-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-sm;
  color: $text-color-light;

  &.featured {
    color: $warning-color;
    font-weight: 600;
  }

  .status-icon {
    font-size: $font-size-md;
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-sm) {
  .modal-overlay {
    padding: $spacing-sm;
  }

  .modal-header {
    padding: $spacing-lg;
  }

  .project-title {
    font-size: $font-size-xl;
  }

  .modal-content {
    padding: $spacing-md;
  }

  .modal-footer {
    padding: $spacing-lg;
  }
}
</style>
