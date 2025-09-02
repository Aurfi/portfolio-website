<template>
  <section class="hero-section section" :id="id">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title animate-fade-in-up">
            <span class="greeting">{{ $t('hero.greeting') }}</span>
            <span class="name gradient-text">{{ $t('hero.name') }}</span>
          </h1>

          <p class="hero-subtitle animate-fade-in-up animate-delay-200">
            {{ $t('hero.subtitle') }}
          </p>

          <div class="hero-skills animate-fade-in-up animate-delay-300">
            <span
              v-for="(skill, index) in skills"
              :key="skill"
              class="skill-tag hover-scale"
              :style="{ animationDelay: `${0.4 + index * 0.1}s` }"
            >
              {{ skill }}
            </span>
          </div>

          <div class="hero-actions animate-fade-in-up animate-delay-500">
            <button class="cta-button primary hover-lift interactive" @click="scrollToProjects">
              {{ $t('hero.viewWork') }}
            </button>

            <button class="cta-button secondary hover-lift interactive" @click="scrollToContact">
              {{ $t('hero.getInTouch') }}
            </button>
          </div>
        </div>

        <div class="hero-visual animate-fade-in animate-delay-300">
          <div class="profile-container">
            <div class="profile-image hover-glow">
              <!-- Placeholder for profile image -->
              <div class="image-placeholder glass">
                <PersonalLogo variant="icon" size="xl" />
              </div>
            </div>

            <div class="floating-elements">
              <div
                class="floating-element animate-float"
                v-for="n in 6"
                :key="n"
                :style="{ animationDelay: `${n * 0.5}s` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-indicator">
        <button class="scroll-button" @click="scrollToNext" :aria-label="$t('hero.scrollDown')">
          <svg class="scroll-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M7 13l3 3 3-3"></path>
            <path d="M7 6l3 3 3-3"></path>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PersonalLogo from '@/components/ui/PersonalLogo.vue'

interface Props {
  id: string
}

defineProps<Props>()

const { t } = useI18n()

// Skills to display
const skills = computed(() => ['Vue.js', 'TypeScript', 'Node.js', 'Docker', 'Spring Boot'])

// Navigation functions
const scrollToProjects = () => {
  const element = document.getElementById('projects')
  element?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToContact = () => {
  const element = document.getElementById('contact')
  element?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToNext = () => {
  const element = document.getElementById('projects')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  background: linear-gradient(
    135deg,
    rgba($primary-color, 0.05) 0%,
    rgba($secondary-color, 0.05) 100%
  );
  overflow: hidden;

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-md;
  }
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-xl;
  align-items: center;
  width: 100%;

  @include respond-to(lg) {
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xxl;
  }
}

.hero-text {
  text-align: center;

  @include respond-to(lg) {
    text-align: left;
  }
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: $spacing-lg;

  .greeting {
    display: block;
    color: $text-color;
    font-size: 0.6em;
    font-weight: 400;
    margin-bottom: $spacing-xs;
    opacity: 0.8;
  }

  .name {
    display: block;
    background: linear-gradient(135deg, $primary-color, $secondary-color);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
}

.hero-subtitle {
  font-size: $font-size-lg;
  color: $text-color-light;
  line-height: 1.6;
  margin-bottom: $spacing-xl;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease-out 0.4s both;

  @include respond-to(lg) {
    margin-left: 0;
    margin-right: 0;
  }
}

.hero-skills {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  justify-content: center;
  margin-bottom: $spacing-xl;
  animation: fadeInUp 0.8s ease-out 0.6s both;

  @include respond-to(lg) {
    justify-content: flex-start;
  }
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

.hero-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.8s both;

  @include respond-to(lg) {
    justify-content: flex-start;
  }

  @include respond-to(sm) {
    flex-direction: column;
    align-items: center;

    @include respond-to(lg) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
}

.cta-button {
  padding: $spacing-md $spacing-xl;
  border-radius: $border-radius-lg;
  font-weight: 600;
  font-size: $font-size-base;
  cursor: pointer;
  transition: all $transition-normal;
  border: 2px solid transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;

  &.primary {
    background: $primary-color;
    color: white;
    border-color: $primary-color;

    &:hover {
      background: color.adjust($primary-color, $lightness: -10%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($primary-color, 0.3);
    }
  }

  &.secondary {
    background: transparent;
    color: $primary-color;
    border-color: $primary-color;

    &:hover {
      background: $primary-color;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($primary-color, 0.2);
    }
  }
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  animation: fadeInRight 1s ease-out 0.4s both;
}

.profile-container {
  position: relative;
  width: 300px;
  height: 300px;

  @include respond-to(lg) {
    width: 400px;
    height: 400px;
  }
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  z-index: 2;
  border: 4px solid rgba($primary-color, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $primary-color, $secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;

  .initials {
    font-size: 4rem;
    font-weight: 700;
    color: white;

    @include respond-to(lg) {
      font-size: 5rem;
    }
  }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba($secondary-color, 0.3);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;

  &:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    top: 60%;
    left: 80%;
    animation-delay: 1s;
    background: rgba($primary-color, 0.3);
  }

  &:nth-child(3) {
    top: 80%;
    left: 20%;
    animation-delay: 2s;
  }

  &:nth-child(4) {
    top: 30%;
    left: 90%;
    animation-delay: 3s;
    background: rgba($secondary-color, 0.2);
  }

  &:nth-child(5) {
    top: 10%;
    left: 70%;
    animation-delay: 4s;
  }

  &:nth-child(6) {
    top: 70%;
    left: 5%;
    animation-delay: 5s;
    background: rgba($primary-color, 0.2);
  }
}

.scroll-indicator {
  position: absolute;
  bottom: $spacing-xl;
  left: 50%;
  transform: translateX(-50%);
  animation: fadeInUp 1s ease-out 1s both;
}

.scroll-button {
  background: none;
  border: none;
  cursor: pointer;
  color: $text-color-light;
  transition: all $transition-normal;
  padding: $spacing-sm;
  border-radius: 50%;

  &:hover {
    color: $primary-color;
    background: rgba($primary-color, 0.1);
    transform: translateY(-2px);
  }
}

.scroll-icon {
  width: 24px;
  height: 24px;
  animation: bounce 2s infinite;
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>
