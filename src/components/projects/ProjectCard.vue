<template>
  <article
    class="project-card"
    @click="$emit('viewDetails', project)"
    @keydown.enter="$emit('viewDetails', project)"
    @keydown.space.prevent="$emit('viewDetails', project)"
    tabindex="0"
    role="button"
    :aria-label="`View details for ${project.title.en} project`"
  >
    <!-- Project Image/Screenshot -->
    <div class="project-image">
      <LazyImage
        :src="project.screenshots[0] || placeholderImage"
        :alt="project.title.en"
        :placeholder="placeholderImage"
        class="project-screenshot"
        @error="handleImageError"
      />
      <div class="project-overlay">
        <div class="overlay-content">
          <button
            class="view-details-btn"
            @click.stop="$emit('viewDetails', project)"
            :aria-label="`View details for ${project.title.en}`"
          >
            {{ $t('projects.viewDetails') }}
          </button>
          <div class="project-links">
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link demo-link"
              @click.stop
              :aria-label="`View live demo of ${project.title.en} (opens in new tab)`"
            >
              {{ $t('projects.viewDemo') }}
            </a>
            <a
              v-if="project.repositoryUrl"
              :href="project.repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="project-link code-link"
              @click.stop
              :aria-label="`View source code for ${project.title.en} (opens in new tab)`"
            >
              {{ $t('projects.viewCode') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Featured Badge -->
      <div v-if="project.featured" class="featured-badge">
        <AppIcon name="star" size="xs" solid />
        {{ $t('projects.featured') }}
      </div>

      <!-- Complexity Indicator -->
      <div class="complexity-badge" :class="`complexity-${project.complexity.level}`">
        {{ getComplexityLabel(project.complexity.level) }}
      </div>
    </div>

    <!-- Project Content -->
    <div class="project-content">
      <!-- Header -->
      <div class="project-header">
        <h3 class="project-title">{{ project.title.en }}</h3>
        <div class="project-category" :style="{ color: project.category.color }">
          {{ project.category.name.en }}
        </div>
      </div>

      <!-- Description -->
      <p class="project-description">{{ project.shortDescription.en }}</p>

      <!-- Project Metadata -->
      <div class="project-metadata">
        <div class="metadata-item">
          <span class="metadata-label">{{ $t('projects.duration') }}:</span>
          <span class="metadata-value">{{ project.developmentDuration }}</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">{{ $t('projects.completed') }}:</span>
          <span class="metadata-value">{{ formatDate(project.completionDate) }}</span>
        </div>
      </div>

      <!-- Technology Tags -->
      <div class="technology-tags">
        <span v-for="tech in project.technologies.slice(0, 4)" :key="tech" class="tech-tag">
          {{ tech }}
        </span>
        <span v-if="project.technologies.length > 4" class="tech-tag more-tech">
          +{{ project.technologies.length - 4 }}
        </span>
      </div>

      <!-- Key Highlights Preview -->
      <div v-if="project.highlights.en.length > 0" class="highlights-preview">
        <div class="highlight-item">
          <AppIcon name="check" size="xs" class="highlight-icon" />
          <span class="highlight-text">{{ project.highlights.en[0] }}</span>
        </div>
        <div v-if="project.highlights.en.length > 1" class="more-highlights">
          +{{ project.highlights.en.length - 1 }} {{ $t('projects.moreFeatures') }}
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="project-footer">
      <div class="project-stats">
        <div class="stat-item">
          <AppIcon name="wrench" size="xs" class="stat-icon" />
          <span class="stat-text">{{ project.complexity.level }}</span>
        </div>
        <div v-if="!project.isExternal" class="stat-item">
          <AppIcon name="link" size="xs" class="stat-icon" />
          <span class="stat-text">{{ $t('projects.integrated') }}</span>
        </div>
        <div v-else class="stat-item">
          <AppIcon name="globe" size="xs" class="stat-icon" />
          <span class="stat-text">{{ $t('projects.external') }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types'
import LazyImage from '@/components/ui/LazyImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

interface Props {
  project: Project
}

interface Emits {
  (e: 'viewDetails', project: Project): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

// Computed properties
const placeholderImage = computed(() => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6c757d" font-family="Arial, sans-serif" font-size="16">
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

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
  }).format(date)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.project-card {
  @include card;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  height: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);

    .project-overlay {
      opacity: 1;
    }

    .project-image img {
      transform: scale(1.02);
    }

    .project-title {
      color: $secondary-color;
    }
  }
}

// Project Image Section
.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: $background-light;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($primary-color, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.overlay-content {
  text-align: center;
  color: white;
}

.view-details-btn {
  @include button-base;
  background: white;
  color: $primary-color;
  margin-bottom: $spacing-md;
  font-weight: 600;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}

.project-links {
  display: flex;
  gap: $spacing-sm;
  justify-content: center;
}

.project-link {
  padding: $spacing-xs $spacing-sm;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: $border-radius-sm;
  color: white;
  text-decoration: none;
  font-size: $font-size-sm;
  transition: all $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
}

// Badges
.featured-badge {
  position: absolute;
  top: $spacing-sm;
  left: $spacing-sm;
  background: $warning-color;
  color: white;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-md;
  font-size: $font-size-xs;
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.complexity-badge {
  position: absolute;
  top: $spacing-sm;
  right: $spacing-sm;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-md;
  font-size: $font-size-xs;
  font-weight: 600;
  color: white;
  z-index: 2;

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

// Project Content
.project-content {
  padding: $spacing-lg;
}

.project-header {
  margin-bottom: $spacing-md;
}

.project-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-color;
  margin: 0 0 $spacing-xs 0;
  line-height: 1.3;
  transition: color $transition-normal;
}

.project-category {
  font-size: $font-size-sm;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.project-description {
  color: $text-color-light;
  line-height: 1.6;
  margin-bottom: $spacing-md;
  font-size: $font-size-sm;
  @include text-clamp(3);
}

// Metadata
.project-metadata {
  margin-bottom: $spacing-md;
  font-size: $font-size-xs;
}

.metadata-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: $spacing-xs;

  &:last-child {
    margin-bottom: 0;
  }
}

.metadata-label {
  color: $text-color-light;
  font-weight: 500;
}

.metadata-value {
  color: $text-color;
  font-weight: 600;
}

// Technology Tags
.technology-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-bottom: $spacing-md;
}

.tech-tag {
  background: rgba($primary-color, 0.1);
  color: $primary-color;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-sm;
  font-size: $font-size-xs;
  font-weight: 500;
  white-space: nowrap;

  &.more-tech {
    background: rgba($text-color-light, 0.1);
    color: $text-color-light;
  }
}

// Highlights Preview
.highlights-preview {
  margin-bottom: $spacing-md;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-xs;
  margin-bottom: $spacing-xs;
  font-size: $font-size-sm;
}

.highlight-icon {
  color: $success-color;
  flex-shrink: 0;
}

.highlight-text {
  color: $text-color;
  line-height: 1.4;
  @include text-clamp(2);
}

.more-highlights {
  font-size: $font-size-xs;
  color: $text-color-light;
  font-style: italic;
  margin-left: calc(#{$spacing-xs} + 0.8em);
}

// Project Footer
.project-footer {
  padding: $spacing-md $spacing-lg;
  background: $background-light;
  border-top: 1px solid $border-color;
}

.project-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  font-size: $font-size-xs;
  color: $text-color-light;
}

.stat-icon {
  color: $text-color-light;
}

.stat-text {
  font-weight: 500;
  text-transform: capitalize;
}

// Responsive Design
@media (max-width: $breakpoint-sm) {
  .project-content {
    padding: $spacing-md;
  }

  .project-footer {
    padding: $spacing-sm $spacing-md;
  }

  .project-stats {
    flex-direction: column;
    gap: $spacing-xs;
    align-items: flex-start;
  }

  .technology-tags {
    .tech-tag:nth-child(n + 4) {
      display: none;
    }
  }
}
</style>
