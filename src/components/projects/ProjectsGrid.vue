<template>
  <div class="projects-grid-container">
    <!-- Filter/Category System -->
    <section class="filter-section" aria-labelledby="filter-title">
      <div class="filter-header">
        <h3 id="filter-title" class="filter-title">{{ $t('projects.filterBy') }}</h3>
        <div class="results-count" aria-live="polite" aria-atomic="true">
          {{ filteredProjects.length }} {{ $t('projects.projectsFound') }}
        </div>
      </div>

      <div
        class="category-filters"
        role="group"
        aria-labelledby="filter-title"
        aria-describedby="filter-description"
      >
        <div id="filter-description" class="sr-only">
          Use these buttons to filter projects by category. Current selection:
          {{ getCurrentCategoryName() }}
        </div>
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-filter', { active: selectedCategory === category.id }]"
          :style="{ '--category-color': category.color }"
          @click="selectCategory(category.id)"
          :aria-pressed="selectedCategory === category.id"
          :aria-label="`Filter by ${category.name.en}, ${getProjectCount(category.id)} projects`"
          type="button"
        >
          <span class="category-icon" :data-icon="category.icon" aria-hidden="true"></span>
          <span class="category-name">{{ category.name.en }}</span>
          <span class="category-count" aria-hidden="true">{{ getProjectCount(category.id) }}</span>
        </button>
      </div>
    </section>

    <!-- Projects Grid -->
    <section
      class="projects-grid"
      aria-labelledby="projects-heading"
    >
      <h2 id="projects-heading" class="sr-only">
        {{ selectedCategory === 'all' ? 'All Projects' : getCurrentCategoryName() + ' Projects' }}
      </h2>
      <TransitionGroup name="project-card" tag="div" class="grid-container">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @view-details="openProjectModal"
        />
      </TransitionGroup>
    </section>

    <!-- Empty State -->
    <div
      v-if="filteredProjects.length === 0 && !isLoading"
      class="empty-state"
      role="status"
      aria-live="polite"
    >
      <div class="empty-icon" aria-hidden="true">📂</div>
      <h3>{{ $t('projects.noProjectsFound') }}</h3>
      <p>{{ $t('projects.tryDifferentFilter') }}</p>
      <button class="reset-filter-btn" @click="selectCategory('all')" type="button">
        {{ $t('projects.showAllProjects') }}
      </button>
    </div>

    <!-- Project Detail Modal -->
    <ProjectDetailModal
      v-if="selectedProject"
      :project="selectedProject"
      @close="closeProjectModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { projectCategories, getProjectsByCategory } from '@/data/projects'
import type { Project } from '@/types'
import ProjectCard from './ProjectCard.vue'
import ProjectDetailModal from './ProjectDetailModal.vue'
import { useAccessibility } from '@/composables/useAccessibility'

// Composables
const { announce } = useAccessibility()

// Reactive state
const selectedCategory = ref('all')
const selectedProject = ref<Project | null>(null)

// Computed properties
const categories = computed(() => projectCategories)

const filteredProjects = computed(() => {
  return getProjectsByCategory(selectedCategory.value)
})

// Methods
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId

  // Announce filter change to screen readers
  const categoryName = getCurrentCategoryName()
  const projectCount = getProjectCount(categoryId)
  announce(`Filtered to ${categoryName}. Showing ${projectCount} projects.`)
}

const getProjectCount = (categoryId: string) => {
  return getProjectsByCategory(categoryId).length
}

const getCurrentCategoryName = () => {
  if (selectedCategory.value === 'all') return 'All Categories'
  const category = categories.value.find((cat) => cat.id === selectedCategory.value)
  return category?.name.en || 'Unknown Category'
}

const openProjectModal = (project: Project) => {
  selectedProject.value = project
}

const closeProjectModal = () => {
  selectedProject.value = null
}

</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.projects-grid-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-md;
}

// Filter Section
.filter-section {
  margin-bottom: $spacing-xxl;
}

.filter-header {
  @include flex-between;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;

  @include respond-to(sm) {
    flex-wrap: nowrap;
  }
}

.filter-title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: $text-color;
  margin: 0;
}

.results-count {
  font-size: $font-size-sm;
  color: $text-color-light;
  background: $background-light;
  padding: $spacing-xs $spacing-sm;
  border-radius: $border-radius-md;
  font-weight: 500;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.category-filter {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border: 2px solid $border-color;
  border-radius: $border-radius-lg;
  background: white;
  color: $text-color;
  font-size: $font-size-sm;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--category-color);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &.active {
    border-color: var(--category-color);
    background: var(--category-color);
    color: white;

    .category-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }

  .category-icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;

    &[data-icon='grid']::before {
      content: '⊞';
    }
    &[data-icon='globe']::before {
      content: '🌐';
    }
    &[data-icon='smartphone']::before {
      content: '📱';
    }
    &[data-icon='server']::before {
      content: '🖥️';
    }
    &[data-icon='layout']::before {
      content: '🎨';
    }
  }

  .category-name {
    white-space: nowrap;
  }

  .category-count {
    background: $background-light;
    color: $text-color-light;
    padding: 2px 6px;
    border-radius: $border-radius-sm;
    font-size: $font-size-xs;
    font-weight: 600;
    min-width: 20px;
    text-align: center;
  }
}

// Projects Grid
.projects-grid {
  margin-bottom: $spacing-xxl;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}

// Empty State
.empty-state {
  text-align: center;
  padding: $spacing-xxl;
  color: $text-color-light;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: $spacing-lg;
    opacity: 0.5;
  }

  h3 {
    font-size: $font-size-xl;
    margin-bottom: $spacing-sm;
    color: $text-color;
  }

  p {
    margin-bottom: $spacing-lg;
    font-size: $font-size-md;
  }

  .reset-filter-btn {
    @include button-primary;
    padding: $spacing-sm $spacing-lg;
  }
}

// Animations - Apple-like, subtle and elegant
.project-card-enter-active,
.project-card-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.project-card-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.project-card-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.project-card-move {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

// Responsive adjustments
@media (max-width: $breakpoint-sm) {
  .category-filters {
    justify-content: center;
  }

  .category-filter {
    flex: 1;
    min-width: 120px;
    justify-content: center;

    .category-name {
      display: none;
    }
  }

  .filter-header {
    text-align: center;
    flex-direction: column;
  }
}
</style>
