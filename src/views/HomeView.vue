<script setup lang="ts">
import HeroSection from '@/components/sections/HeroSection.vue'
import ProjectsSection from '@/components/sections/ProjectsSection.vue'
</script>

<template>
  <div class="home-page">
    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <HeroSection id="hero" class="hero-section" />
      
      <!-- Quick About -->
      <section class="quick-about section">
        <div class="container">
          <div class="about-content">
            <h2 class="section-title">{{ $t('about.quickTitle') }}</h2>
            <p class="section-description">
              {{ $t('about.quickDescription') }}
            </p>
            <div class="skills-highlight">
              <div class="skill-category">
                <h3>{{ $t('about.frontend') }}</h3>
                <span>Vue.js, React, TypeScript, SCSS</span>
              </div>
              <div class="skill-category">
                <h3>{{ $t('about.backend') }}</h3>
                <span>Node.js, Spring Boot, PostgreSQL, Redis</span>
              </div>
              <div class="skill-category">
                <h3>{{ $t('about.tools') }}</h3>
                <span>Docker, AWS, Git, Figma</span>
              </div>
            </div>
            <router-link to="/about" class="learn-more-btn">
              {{ $t('about.learnMore') }}
            </router-link>
          </div>
        </div>
      </section>
      
      <!-- Featured Projects -->
      <ProjectsSection id="featured-projects" />
      
      <!-- Call to Action -->
      <section class="cta-section section">
        <div class="container">
          <div class="cta-content">
            <h2 class="cta-title">{{ $t('cta.title') }}</h2>
            <p class="cta-description">{{ $t('cta.description') }}</p>
            <div class="cta-actions">
              <router-link to="/contact" class="cta-button primary">
                {{ $t('cta.getInTouch') }}
              </router-link>
              <router-link to="/projects" class="cta-button secondary">
                {{ $t('cta.viewProjects') }}
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.home-page {
  min-height: 100vh;
}

.main-content {
  width: 100%;
}

.hero-section {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Quick About Section
.quick-about {
  padding: $spacing-xl 0;
  background: rgba($background-color, 0.3);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-md;
  }
}

.about-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: $text-color;
  margin-bottom: $spacing-lg;
}

.section-description {
  font-size: $font-size-lg;
  color: $text-color-light;
  line-height: 1.7;
  margin-bottom: $spacing-xl;
}

.skills-highlight {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;

  @include respond-to(md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.skill-category {
  padding: $spacing-lg;
  background: white;
  border-radius: $border-radius-lg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;

  h3 {
    font-size: $font-size-md;
    font-weight: 600;
    color: $primary-color;
    margin-bottom: $spacing-sm;
  }

  span {
    font-size: $font-size-sm;
    color: $text-color-light;
    line-height: 1.5;
  }
}

.learn-more-btn {
  display: inline-flex;
  align-items: center;
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
    box-shadow: 0 4px 12px rgba($primary-color, 0.3);
  }
}

// Call to Action Section
.cta-section {
  padding: $spacing-lg 0;
  background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
  color: white;

  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 $spacing-md;
  }
}

.cta-content {
  text-align: center;
}

.cta-title {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: 500;
  margin-bottom: $spacing-xs;
}

.cta-description {
  font-size: $font-size-sm;
  margin-bottom: $spacing-md;
  opacity: 0.8;
  line-height: 1.4;
}

.cta-actions {
  display: flex;
  gap: $spacing-sm;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  padding: $spacing-sm $spacing-lg;
  border-radius: $border-radius-md;
  font-weight: 500;
  transition: all $transition-normal;
  min-width: 140px;
  justify-content: center;
  font-size: $font-size-sm;

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
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 100%;
    max-width: 280px;
  }
}
</style>
