<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="about-hero section">
      <div class="container">
        <div class="about-hero-content">
          <div class="about-text">
            <h1 class="about-title animate-fade-in-up">
              {{ $t('about.title') }}
            </h1>
            <p class="about-subtitle animate-fade-in-up animate-delay-200">
              {{ $t('about.subtitle') }}
            </p>
          </div>
          
          <div class="about-visual animate-fade-in animate-delay-300">
            <div class="about-image-container">
              <div class="about-image">
                <!-- Blue gradient background -->
                <div class="about-avatar-background"></div>
                
                <!-- Fixed logo content -->
                <div class="about-avatar-content">
                  <PersonalLogo variant="icon" size="xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main About Content -->
    <section class="about-content section">
      <div class="container">
        <div class="content-grid">
          <!-- Story Section -->
          <div class="about-story">
            <h2 class="section-title">{{ $t('common.myStory') }}</h2>
            <div class="story-content">
              <p class="story-paragraph">
                {{ $t('about.description1') }}
              </p>
              <p class="story-paragraph">
                {{ $t('about.description2') }}
              </p>
              <p class="story-paragraph">
                I believe in writing clean, maintainable code and creating user experiences that are both beautiful and functional. Every project is an opportunity to learn something new and push the boundaries of what's possible.
              </p>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="skills-section">
            <h2 class="section-title">{{ $t('common.technicalSkills') }}</h2>
            <div class="skills-grid">
              <div class="skill-category">
                <h3 class="skill-category-title">{{ $t('about.frontend') }}</h3>
                <div class="skill-tags">
                  <span class="skill-tag">{{ $t('common.skills.vue') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.react') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.typescript') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.scss') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.tailwindcss') }}</span>
                </div>
              </div>
              
              <div class="skill-category">
                <h3 class="skill-category-title">{{ $t('about.backend') }}</h3>
                <div class="skill-tags">
                  <span class="skill-tag">{{ $t('common.skills.nodejs') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.springboot') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.postgresql') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.mongodb') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.restapis') }}</span>
                </div>
              </div>
              
              <div class="skill-category">
                <h3 class="skill-category-title">{{ $t('about.tools') }}</h3>
                <div class="skill-tags">
                  <span class="skill-tag">{{ $t('common.skills.docker') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.aws') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.git') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.figma') }}</span>
                  <span class="skill-tag">{{ $t('common.skills.vscode') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section class="experience-section section">
      <div class="container">
        <h2 class="section-title">{{ $t('about.experience') }}</h2>
        <div class="experience-timeline">
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h3 class="timeline-title">{{ $t('common.positions.seniorFullstackDeveloper') }}</h3>
              <p class="timeline-company">{{ $t('common.companies.techcorp') }}</p>
              <p class="timeline-period">2022 - Present</p>
              <p class="timeline-description">
                Leading development of scalable web applications using Vue.js and Spring Boot. 
                Mentoring junior developers and implementing best practices for code quality and performance.
              </p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h3 class="timeline-title">{{ $t('common.positions.fullstackDeveloper') }}</h3>
              <p class="timeline-company">{{ $t('common.companies.innovatelabs') }}</p>
              <p class="timeline-period">2020 - 2022</p>
              <p class="timeline-description">
                Developed and maintained multiple client projects using modern web technologies. 
                Collaborated closely with designers and product managers to deliver exceptional user experiences.
              </p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h3 class="timeline-title">{{ $t('common.positions.frontendDeveloper') }}</h3>
              <p class="timeline-company">{{ $t('common.companies.startupventure') }}</p>
              <p class="timeline-period">2019 - 2020</p>
              <p class="timeline-description">
                Built responsive web applications and contributed to the company's design system. 
                Gained experience in agile development and cross-functional collaboration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Actions Section -->
    <section class="about-actions section">
      <div class="container">
        <div class="actions-content">
          <h2 class="actions-title">Let's Connect</h2>
          <p class="actions-description">
            Interested in working together or want to learn more about my experience?
          </p>
          <div class="actions-buttons">
            <button @click="handleDownloadResume" class="action-button primary" aria-label="Download my resume">
              {{ $t('about.downloadResume') }}
            </button>
            <router-link to="/projects" class="action-button secondary">
              {{ $t('navigation.projects') }}
            </router-link>
            <router-link to="/contact" class="action-button secondary">
              {{ $t('about.getInTouch') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PersonalLogo from '@/components/ui/PersonalLogo.vue'
import { resumeData } from '@/utils/resumeData'
import { downloadResume } from '@/utils/pdfGenerator'

const handleDownloadResume = () => {
  try {
    downloadResume(resumeData)
  } catch (error) {
    console.error('Error generating resume:', error)
    // Fallback: could show a notification or try alternative method
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.about-page {
  min-height: 100vh;
}

.section {
  padding: $spacing-xl 0;
  
  @include respond-to(lg) {
    padding: $spacing-2xl 0;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-md;
}

// Hero Section
.about-hero {
  padding-top: calc($spacing-2xl + 80px); // Account for fixed header
  background: linear-gradient(
    135deg,
    rgba($primary-color, 0.05) 0%,
    rgba($secondary-color, 0.05) 100%
  );
}

.about-hero-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;
  align-items: center;
  
  @include respond-to(lg) {
    grid-template-columns: 2fr 1fr;
    gap: $spacing-2xl;
  }
}

.about-text {
  text-align: center;
  
  @include respond-to(lg) {
    text-align: left;
  }
}

.about-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: $text-color;
  margin-bottom: $spacing-lg;
  line-height: 1.1;
}

.about-subtitle {
  font-size: $font-size-xl;
  color: $text-color-light;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  
  @include respond-to(lg) {
    margin: 0;
  }
}

.about-visual {
  display: flex;
  justify-content: center;
}

.about-image-container {
  position: relative;
  width: 250px;
  height: 250px;
  
  @include respond-to(lg) {
    width: 300px;
    height: 300px;
  }
}

.about-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 20px 40px rgba($primary-color, 0.15),
    0 8px 32px rgba($secondary-color, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.about-avatar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
}

.about-avatar-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;

  :deep(svg) {
    width: 200px !important;
    height: 200px !important;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
  }

  :deep(text) {
    font-size: 24px !important;
    font-weight: 700 !important;
  }
}

// Content Section
.about-content {
  background: $background-color;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-2xl;
  
  @include respond-to(lg) {
    grid-template-columns: 1fr 1fr;
    gap: $spacing-3xl;
  }
}

.section-title {
  font-size: $font-size-2xl;
  font-weight: 700;
  color: $text-color;
  margin-bottom: $spacing-xl;
}

.about-story {
  .story-content {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }
  
  .story-paragraph {
    font-size: $font-size-lg;
    line-height: 1.7;
    color: $text-color-light;
  }
}

// Skills Section
.skills-grid {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.skill-category {
  .skill-category-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $primary-color;
    margin-bottom: $spacing-md;
  }
  
  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
  
  .skill-tag {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-full;
    font-size: $font-size-sm;
    font-weight: 500;
    border: 1px solid rgba($primary-color, 0.2);
    transition: all $transition-normal;
    
    &:hover {
      background: rgba($primary-color, 0.2);
      transform: translateY(-2px);
    }
  }
}

// Experience Section
.experience-section {
  background: rgba($background-color, 0.5);
}

.experience-timeline {
  position: relative;
  padding-left: $spacing-xl;
  
  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, $primary-color, $secondary-color);
  }
}

.timeline-item {
  position: relative;
  margin-bottom: $spacing-2xl;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: -$spacing-xl;
  top: 0;
  width: 32px;
  height: 32px;
  background: $primary-color;
  border-radius: 50%;
  border: 4px solid $background-color;
  box-shadow: 0 0 0 4px rgba($primary-color, 0.2);
}

.timeline-content {
  background: white;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba($primary-color, 0.1);
}

.timeline-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-color;
  margin-bottom: $spacing-xs;
}

.timeline-company {
  font-size: $font-size-md;
  font-weight: 500;
  color: $primary-color;
  margin-bottom: $spacing-xs;
}

.timeline-period {
  font-size: $font-size-sm;
  color: $text-color-light;
  margin-bottom: $spacing-md;
  font-style: italic;
}

.timeline-description {
  font-size: $font-size-base;
  line-height: 1.6;
  color: $text-color-light;
}

// Actions Section
.about-actions {
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  color: white;
}

.actions-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.actions-title {
  font-size: $font-size-2xl;
  font-weight: 600;
  margin-bottom: $spacing-md;
}

.actions-description {
  font-size: $font-size-lg;
  margin-bottom: $spacing-xl;
  opacity: 0.9;
}

.actions-buttons {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-lg;
  font-weight: 600;
  transition: all $transition-normal;
  min-width: 160px;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  
  &.primary {
    background: white;
    color: $primary-color;
    
    &:hover {
      background: rgba(white, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: white;
      color: $primary-color;
      transform: translateY(-2px);
    }
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-sm) {
  .actions-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>