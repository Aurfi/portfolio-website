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
              <!-- Blue gradient background that breathes -->
              <div class="avatar-background"></div>
              
              <!-- Fixed logo content -->
              <div class="avatar-content">
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PersonalLogo from '@/components/ui/PersonalLogo.vue'

interface Props {
  id: string
}

defineProps<Props>()

const router = useRouter()

// Skills to display
const skills = computed(() => ['Vue.js', 'TypeScript', 'Node.js', 'Docker', 'Spring Boot'])

// Navigation functions
const scrollToProjects = () => {
  router.push('/projects')
}

const scrollToContact = () => {
  router.push('/contact')
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
    position: relative;
    background: linear-gradient(
      135deg,
      $primary-color 0%,
      $primary-light 25%,
      $secondary-color 50%,
      $secondary-light 75%,
      $primary-color 100%
    );
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: 
      fadeInUp 0.8s $ease-out-quart 0.2s both, 
      appleGradientFlow 24s $ease-in-out-quart infinite,
      subtleBreathing 8s $ease-in-out-quart infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba($primary-color, 0.1) 0%,
        rgba($secondary-color, 0.1) 100%
      );
      background-size: 400% 400%;
      border-radius: 8px;
      opacity: 0.6;
      filter: blur(20px);
      z-index: -1;
      animation: appleGlowFlow 32s $ease-in-out-quart infinite;
    }
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
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 20px 40px rgba($primary-color, 0.15),
    0 8px 32px rgba($secondary-color, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.6s $ease-out-quart;
  
  // Subtle ring animation
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      rgba($primary-color, 0.3) 0%,
      rgba($secondary-color, 0.2) 50%,
      rgba($primary-color, 0.3) 100%
    );
    background-size: 200% 200%;
    animation: subtleRingFlow 16s $ease-in-out-quart infinite;
    z-index: -1;
    opacity: 0.6;
  }
  
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 
      0 24px 48px rgba($primary-color, 0.2),
      0 12px 36px rgba($secondary-color, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

.avatar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    $primary-color 0%,
    $secondary-color 50%,
    $primary-color 100%
  );
  background-size: 400% 400%;
  animation: 
    appleGradientFlow 28s $ease-in-out-quart infinite,
    avatarBreathing 16s $ease-in-out-quart infinite;
}

.avatar-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  :deep(svg) {
    width: 240px !important;
    height: 240px !important;
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
  width: 16px;
  height: 16px;
  border-radius: 50%;
  filter: blur(0.5px);
  opacity: 0.4;
  animation: appleFloat 12s $ease-in-out-quart infinite;

  &:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
    background: linear-gradient(135deg, rgba($secondary-color, 0.2), rgba($secondary-light, 0.15));
    width: 18px;
    height: 18px;
  }

  &:nth-child(2) {
    top: 60%;
    left: 80%;
    animation-delay: 2s;
    background: linear-gradient(135deg, rgba($primary-color, 0.25), rgba($primary-light, 0.2));
  }

  &:nth-child(3) {
    top: 80%;
    left: 20%;
    animation-delay: 4s;
    background: linear-gradient(135deg, rgba($secondary-color, 0.15), rgba($secondary-light, 0.1));
    width: 14px;
    height: 14px;
  }

  &:nth-child(4) {
    top: 30%;
    left: 90%;
    animation-delay: 6s;
    background: linear-gradient(135deg, rgba($secondary-color, 0.1), rgba($secondary-light, 0.08));
    width: 12px;
    height: 12px;
  }

  &:nth-child(5) {
    top: 10%;
    left: 70%;
    animation-delay: 8s;
    background: linear-gradient(135deg, rgba($primary-color, 0.2), rgba($primary-light, 0.15));
    width: 20px;
    height: 20px;
  }

  &:nth-child(6) {
    top: 70%;
    left: 5%;
    animation-delay: 10s;
    background: linear-gradient(135deg, rgba($primary-color, 0.15), rgba($primary-light, 0.1));
  }
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

// Apple-like floating with reduced motion and organic movement
@keyframes appleFloat {
  0% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-8px) translateX(3px) scale(1.05);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-12px) translateX(-2px) scale(0.95);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-6px) translateX(1px) scale(1.02);
    opacity: 0.6;
  }
  100% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.3;
  }
}

// Apple-like gradient animations with organic, subtle movement
@keyframes appleGradientFlow {
  0% {
    background-position: 0% 20%;
  }
  20% {
    background-position: 40% 30%;
  }
  40% {
    background-position: 80% 60%;
  }
  60% {
    background-position: 90% 90%;
  }
  80% {
    background-position: 20% 70%;
  }
  100% {
    background-position: 0% 20%;
  }
}

// Subtle breathing effect for text
@keyframes subtleBreathing {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.005);
    filter: brightness(1.05);
  }
}

// Ambient glow animation
@keyframes appleGlowFlow {
  0% {
    background-position: 0% 50%;
    opacity: 0.5;
    filter: blur(40px);
  }
  12.5% {
    background-position: 25% 75%;
    opacity: 0.6;
    filter: blur(35px);
  }
  25% {
    background-position: 50% 100%;
    opacity: 0.7;
    filter: blur(30px);
  }
  37.5% {
    background-position: 75% 75%;
    opacity: 0.8;
    filter: blur(25px);
  }
  50% {
    background-position: 100% 50%;
    opacity: 0.75;
    filter: blur(30px);
  }
  62.5% {
    background-position: 75% 25%;
    opacity: 0.7;
    filter: blur(35px);
  }
  75% {
    background-position: 50% 0%;
    opacity: 0.6;
    filter: blur(40px);
  }
  87.5% {
    background-position: 25% 25%;
    opacity: 0.55;
    filter: blur(42px);
  }
  100% {
    background-position: 0% 50%;
    opacity: 0.5;
    filter: blur(40px);
  }
}

// Subtle shimmer overlay
@keyframes subtleShimmer {
  0% {
    background-position: -100% 0%;
    opacity: 0.1;
  }
  50% {
    background-position: 100% 100%;
    opacity: 0.2;
  }
  100% {
    background-position: -100% 0%;
    opacity: 0.1;
  }
}

// Avatar gentle pulse
@keyframes avatarBreathing {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.75);
  }
}

// Counter-scale to keep logo fixed size
@keyframes counterBreathing {
  0%, 100% {
    transform: translate(-50%, -50%) scale(5);
  }
  50% {
    transform: translate(-50%, -50%) scale(6.65);
  }
}

// Subtle ring flow around avatar
@keyframes subtleRingFlow {
  0% {
    background-position: 0% 50%;
    opacity: 0.4;
  }
  25% {
    background-position: 100% 0%;
    opacity: 0.6;
  }
  50% {
    background-position: 100% 100%;
    opacity: 0.5;
  }
  75% {
    background-position: 0% 100%;
    opacity: 0.7;
  }
  100% {
    background-position: 0% 50%;
    opacity: 0.4;
  }
}

</style>
