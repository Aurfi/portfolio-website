<template>
  <section class="about-section section" :id="id">
    <div class="container">
      <div class="about-content">
        <div class="about-text">
          <div class="section-header">
            <h2 class="section-title">{{ $t('about.title') }}</h2>
            <p class="section-subtitle">{{ $t('about.subtitle') }}</p>
          </div>

          <div class="about-description">
            <p>{{ $t('about.description1') }}</p>
            <p>{{ $t('about.description2') }}</p>
          </div>

          <div class="skills-grid">
            <div v-for="category in skillCategories" :key="category.name" class="skill-category">
              <h3 class="category-title">{{ category.name }}</h3>
              <div class="skills-list">
                <div v-for="skill in category.skills" :key="skill.name" class="skill-item">
                  <span class="skill-name">{{ skill.name }}</span>
                  <div class="skill-bar">
                    <div class="skill-progress" :style="{ width: `${skill.level}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="about-actions">
            <button class="download-resume-button" @click="downloadResume">
              {{ $t('about.downloadResume') }}
              <svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>

            <button class="contact-button" @click="scrollToContact">
              {{ $t('about.getInTouch') }}
            </button>
          </div>
        </div>

        <div class="about-visual">
          <div class="experience-timeline">
            <h3 class="timeline-title">{{ $t('about.experience') }}</h3>

            <div class="timeline">
              <div v-for="item in experienceItems" :key="item.id" class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="timeline-date">{{ item.date }}</div>
                  <h4 class="timeline-title">{{ item.title }}</h4>
                  <p class="timeline-company">{{ item.company }}</p>
                  <p class="timeline-description">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="stats-grid">
            <div v-for="stat in stats" :key="stat.label" class="stat-item">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
}

defineProps<Props>()

// Skills data
const skillCategories = computed(() => [
  {
    name: 'Frontend',
    skills: [
      { name: 'Vue.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'React', level: 80 },
      { name: 'SCSS/CSS', level: 88 },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Spring Boot', level: 82 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'Docker', level: 78 },
    ],
  },
  {
    name: 'Tools & Others',
    skills: [
      { name: 'Git', level: 90 },
      { name: 'CI/CD', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Testing', level: 80 },
    ],
  },
])

// Experience timeline
const experienceItems = computed(() => [
  {
    id: 1,
    date: '2023 - Present',
    title: 'Senior Full Stack Developer',
    company: 'Tech Solutions Inc.',
    description:
      'Leading development of enterprise applications using modern web technologies and microservices architecture.',
  },
  {
    id: 2,
    date: '2021 - 2023',
    title: 'Frontend Developer',
    company: 'Digital Agency Co.',
    description:
      'Developed responsive web applications and collaborated with design teams to create exceptional user experiences.',
  },
  {
    id: 3,
    date: '2019 - 2021',
    title: 'Junior Developer',
    company: 'StartUp Ventures',
    description:
      'Built web applications from scratch and gained experience in full-stack development and agile methodologies.',
  },
])

// Statistics
const stats = computed(() => [
  { value: '50+', label: 'Projects Completed' },
  { value: '5+', label: 'Years Experience' },
  { value: '20+', label: 'Technologies' },
  { value: '100%', label: 'Client Satisfaction' },
])

// Actions
const downloadResume = () => {
  // TODO: Implement resume download
  console.log('Downloading resume...')
}

const scrollToContact = () => {
  const element = document.getElementById('contact')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.about-section {
  padding: $spacing-xxl 0;
  background: white;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xxl;
  align-items: start;

  @include respond-to(lg) {
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xxxl;
  }
}

.section-header {
  margin-bottom: $spacing-xl;
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
  line-height: 1.6;
}

.about-description {
  margin-bottom: $spacing-xl;

  p {
    color: $text-color-light;
    line-height: 1.7;
    margin-bottom: $spacing-md;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.skills-grid {
  display: grid;
  gap: $spacing-lg;
  margin-bottom: $spacing-xl;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: 1fr;
  }
}

.skill-category {
  .category-title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-md;
  }
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.skill-item {
  .skill-name {
    display: block;
    font-size: $font-size-sm;
    font-weight: 500;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }
}

.skill-bar {
  height: 6px;
  background: rgba($primary-color, 0.1);
  border-radius: $border-radius-sm;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, $primary-color, $secondary-color);
  border-radius: $border-radius-sm;
  transition: width 1s ease-out;
  animation: fillBar 1.5s ease-out;
}

.about-actions {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.download-resume-button,
.contact-button {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  border-radius: $border-radius-md;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-normal;
  border: 2px solid transparent;
  text-decoration: none;
}

.download-resume-button {
  background: $primary-color;
  color: white;
  border-color: $primary-color;

  &:hover {
    background: color.scale($primary-color, $lightness: -41.1290322581%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($primary-color, 0.3);
  }
}

.contact-button {
  background: transparent;
  color: $primary-color;
  border-color: $primary-color;

  &:hover {
    background: $primary-color;
    color: white;
    transform: translateY(-2px);
  }
}

.download-icon {
  width: 18px;
  height: 18px;
}

.about-visual {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.experience-timeline {
  .timeline-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-lg;
  }
}

.timeline {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: rgba($primary-color, 0.2);
  }
}

.timeline-item {
  position: relative;
  padding-left: $spacing-xl;
  margin-bottom: $spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: 8px;
  top: 8px;
  width: 16px;
  height: 16px;
  background: $primary-color;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
}

.timeline-content {
  .timeline-date {
    font-size: $font-size-sm;
    color: $secondary-color;
    font-weight: 600;
    margin-bottom: $spacing-xs;
  }

  .timeline-title {
    font-size: $font-size-md;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }

  .timeline-company {
    font-size: $font-size-sm;
    color: $primary-color;
    font-weight: 500;
    margin-bottom: $spacing-sm;
  }

  .timeline-description {
    font-size: $font-size-sm;
    color: $text-color-light;
    line-height: 1.6;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;

  @include respond-to(md) {
    grid-template-columns: repeat(4, 1fr);
  }

  @include respond-to(lg) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  text-align: center;
  padding: $spacing-lg;
  background: rgba($primary-color, 0.05);
  border-radius: $border-radius-md;
  border: 1px solid rgba($primary-color, 0.1);

  .stat-number {
    font-size: $font-size-xxl;
    font-weight: 700;
    color: $primary-color;
    margin-bottom: $spacing-xs;
  }

  .stat-label {
    font-size: $font-size-sm;
    color: $text-color-light;
    font-weight: 500;
  }
}

@keyframes fillBar {
  from {
    width: 0;
  }
}
</style>
