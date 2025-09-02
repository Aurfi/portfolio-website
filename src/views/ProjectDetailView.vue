<template>
  <div class="project-detail-view">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ $t('common.loading') }}</p>
      </div>

      <div v-else-if="error" class="error-state">
        <h2>{{ $t('common.error') }}</h2>
        <p>{{ error }}</p>
        <router-link to="/projects" class="back-link">
          ← {{ $t('projects.backToProjects') }}
        </router-link>
      </div>

      <div v-else-if="project" class="project-content">
        <nav class="breadcrumb">
          <router-link to="/projects">{{ $t('projects.title') }}</router-link>
          <span class="separator">›</span>
          <span class="current">{{ project.title.en }}</span>
        </nav>

        <header class="project-header">
          <h1>{{ project.title.en }}</h1>
          <p class="project-description">{{ project.description.en }}</p>

          <div class="project-meta">
            <div class="meta-item">
              <strong>{{ $t('projects.duration') }}:</strong>
              {{ project.developmentDuration }}
            </div>
            <div class="meta-item">
              <strong>{{ $t('projects.complexity') }}:</strong>
              {{ project.complexity.level }}
            </div>
            <div class="meta-item">
              <strong>{{ $t('projects.completed') }}:</strong>
              {{ formatDate(project.completionDate) }}
            </div>
          </div>

          <div class="project-actions">
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
            >
              {{ $t('projects.viewDemo') }}
            </a>
            <a
              v-if="project.repositoryUrl"
              :href="project.repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary"
            >
              {{ $t('projects.viewCode') }}
            </a>
          </div>
        </header>

        <div class="project-details">
          <section class="technologies">
            <h3>{{ $t('projects.technologies') }}</h3>
            <div class="tech-tags">
              <span v-for="tech in project.technologies" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>
          </section>

          <section v-if="project.highlights.length" class="highlights">
            <h3>{{ $t('projects.highlights') }}</h3>
            <ul>
              <li v-for="highlight in project.highlights" :key="highlight.en">
                {{ highlight.en }}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Project } from '@/types'

const route = useRoute()
const router = useRouter()

const project = ref<Project | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const projectId = computed(() => route.params.id as string)

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

const loadProject = async () => {
  try {
    loading.value = true
    error.value = null

    // TODO: Replace with actual project loading logic
    // This is a placeholder for now
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock project data - will be replaced with real data loading
    if (projectId.value === 'sample-project') {
      project.value = {
        id: 'sample-project',
        title: { en: 'Sample Project' },
        description: { en: 'This is a sample project description.' },
        shortDescription: { en: 'Sample project' },
        technologies: ['Vue.js', 'TypeScript', 'SCSS'],
        category: {
          id: 'web',
          name: { en: 'Web Application' },
          color: '#3498db',
          icon: 'web',
        },
        demoUrl: 'https://example.com',
        repositoryUrl: 'https://github.com/example/repo',
        isExternal: false,
        screenshots: [],
        featured: true,
        completionDate: new Date(),
        developmentDuration: '3 months',
        highlights: [
          { en: 'Modern Vue.js 3 architecture' },
          { en: 'Full TypeScript implementation' },
          { en: 'Responsive design' },
        ],
        complexity: {
          level: 'intermediate',
          indicators: ['TypeScript', 'Vue 3', 'SCSS'],
          linesOfCode: 5000,
        },
      }
    } else {
      error.value = 'Project not found'
    }
  } catch (err) {
    error.value = 'Failed to load project'
    console.error('Error loading project:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProject()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.project-detail-view {
  min-height: 100vh;
  padding-top: $spacing-3xl;
}

.loading-state,
.error-state {
  @include flex-column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid $border-color;
  border-top: 3px solid $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: $spacing-md;
}

.breadcrumb {
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;
  color: $text-light;

  a {
    color: $secondary-color;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .separator {
    margin: 0 $spacing-sm;
  }

  .current {
    color: $text-color;
  }
}

.project-header {
  margin-bottom: $spacing-3xl;

  h1 {
    font-size: $font-size-4xl;
    margin-bottom: $spacing-md;
    color: $primary-color;
  }

  .project-description {
    font-size: $font-size-lg;
    color: $text-light;
    margin-bottom: $spacing-lg;
    line-height: 1.6;
  }
}

.project-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-lg;

  .meta-item {
    padding: $spacing-sm;
    background: $background-light;
    border-radius: $border-radius-md;
    font-size: $font-size-sm;
  }
}

.project-actions {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;
}

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

.project-details {
  display: grid;
  gap: $spacing-2xl;

  section {
    h3 {
      margin-bottom: $spacing-md;
      color: $primary-color;
    }
  }
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .tech-tag {
    background: $secondary-color;
    color: white;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    font-weight: 500;
  }
}

.highlights {
  ul {
    list-style: none;
    padding: 0;

    li {
      padding: $spacing-sm 0;
      border-bottom: 1px solid $border-color;
      position: relative;
      padding-left: $spacing-lg;

      &:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: $secondary-color;
        font-weight: bold;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.back-link {
  color: $secondary-color;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
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
