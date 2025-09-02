<template>
  <div class="personal-logo" :class="[`size-${size}`, `variant-${variant}`]">
    <!-- Text Logo -->
    <div v-if="variant === 'text'" class="logo-text">
      <span class="logo-initials">{{ initials }}</span>
      <span v-if="showFullName" class="logo-name">{{ fullName }}</span>
    </div>

    <!-- Icon Logo -->
    <div v-else-if="variant === 'icon'" class="logo-icon">
      <svg viewBox="0 0 100 100" class="logo-svg">
        <!-- Geometric logo design -->
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :style="`stop-color: var(--color-primary); stop-opacity: 1`" />
            <stop offset="100%" :style="`stop-color: var(--color-secondary); stop-opacity: 1`" />
          </linearGradient>
        </defs>

        <!-- Modern geometric design -->
        <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" opacity="0.1" />
        <path
          d="M25 35 L50 20 L75 35 L75 65 L50 80 L25 65 Z"
          fill="url(#logoGradient)"
          opacity="0.8"
        />
        <circle cx="50" cy="50" r="15" fill="var(--color-background)" />
        <text
          x="50"
          y="58"
          text-anchor="middle"
          :fill="variant === 'icon' ? 'var(--color-primary)' : 'currentColor'"
          font-family="var(--font-family-heading)"
          font-weight="700"
          font-size="18"
        >
          {{ initials }}
        </text>
      </svg>
    </div>

    <!-- Combined Logo -->
    <div v-else class="logo-combined">
      <div class="logo-icon-small">
        <svg viewBox="0 0 40 40" class="logo-svg-small">
          <defs>
            <linearGradient id="logoGradientSmall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :style="`stop-color: var(--color-primary); stop-opacity: 1`" />
              <stop offset="100%" :style="`stop-color: var(--color-secondary); stop-opacity: 1`" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="18" fill="url(#logoGradientSmall)" opacity="0.1" />
          <path
            d="M10 14 L20 8 L30 14 L30 26 L20 32 L10 26 Z"
            fill="url(#logoGradientSmall)"
            opacity="0.8"
          />
          <circle cx="20" cy="20" r="6" fill="var(--color-background)" />
          <text
            x="20"
            y="24"
            text-anchor="middle"
            fill="var(--color-primary)"
            font-family="var(--font-family-heading)"
            font-weight="700"
            font-size="8"
          >
            {{ initials }}
          </text>
        </svg>
      </div>
      <div v-if="showFullName" class="logo-text-combined">
        <span class="logo-name">{{ fullName }}</span>
        <span v-if="showTagline" class="logo-tagline">{{ tagline }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'icon' | 'combined'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showFullName?: boolean
  showTagline?: boolean
  fullName?: string
  tagline?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'combined',
  size: 'md',
  showFullName: true,
  showTagline: false,
  fullName: 'John Developer',
  tagline: 'Full-Stack Developer',
})

// Extract initials from full name
const initials = computed(() => {
  return props.fullName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) // Limit to 2 characters
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.personal-logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  // Size variants
  &.size-xs {
    .logo-text .logo-initials {
      font-size: $font-size-sm;
    }
    .logo-text .logo-name {
      font-size: $font-size-xs;
    }
    .logo-icon {
      width: 24px;
      height: 24px;
    }
    .logo-icon-small {
      width: 20px;
      height: 20px;
    }
    .logo-name {
      font-size: $font-size-xs;
    }
    .logo-tagline {
      font-size: 10px;
    }
  }

  &.size-sm {
    .logo-text .logo-initials {
      font-size: $font-size-md;
    }
    .logo-text .logo-name {
      font-size: $font-size-sm;
    }
    .logo-icon {
      width: 32px;
      height: 32px;
    }
    .logo-icon-small {
      width: 24px;
      height: 24px;
    }
    .logo-name {
      font-size: $font-size-sm;
    }
    .logo-tagline {
      font-size: $font-size-xs;
    }
  }

  &.size-md {
    .logo-text .logo-initials {
      font-size: $font-size-lg;
    }
    .logo-text .logo-name {
      font-size: $font-size-md;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
    }
    .logo-icon-small {
      width: 32px;
      height: 32px;
    }
    .logo-name {
      font-size: $font-size-md;
    }
    .logo-tagline {
      font-size: $font-size-sm;
    }
  }

  &.size-lg {
    .logo-text .logo-initials {
      font-size: $font-size-xl;
    }
    .logo-text .logo-name {
      font-size: $font-size-lg;
    }
    .logo-icon {
      width: 56px;
      height: 56px;
    }
    .logo-icon-small {
      width: 40px;
      height: 40px;
    }
    .logo-name {
      font-size: $font-size-lg;
    }
    .logo-tagline {
      font-size: $font-size-md;
    }
  }

  &.size-xl {
    .logo-text .logo-initials {
      font-size: $font-size-xxl;
    }
    .logo-text .logo-name {
      font-size: $font-size-xl;
    }
    .logo-icon {
      width: 72px;
      height: 72px;
    }
    .logo-icon-small {
      width: 56px;
      height: 56px;
    }
    .logo-name {
      font-size: $font-size-xl;
    }
    .logo-tagline {
      font-size: $font-size-lg;
    }
  }
}

// Text Logo
.logo-text {
  display: flex;
  align-items: baseline;
  gap: $spacing-xs;

  .logo-initials {
    font-weight: 700;
    color: var(--color-primary);
    font-family: $font-family-heading;
  }

  .logo-name {
    font-weight: 600;
    color: var(--color-text);
    font-family: $font-family-heading;
  }
}

// Icon Logo
.logo-icon {
  flex-shrink: 0;

  .logo-svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}

// Combined Logo
.logo-combined {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.logo-icon-small {
  flex-shrink: 0;

  .logo-svg-small {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.logo-text-combined {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .logo-name {
    font-weight: 700;
    color: var(--color-text);
    font-family: $font-family-heading;
    line-height: 1.2;
  }

  .logo-tagline {
    color: var(--color-text-light);
    font-weight: 500;
    line-height: 1.2;
  }
}

// Hover effects for interactive logos
.personal-logo {
  cursor: pointer;
  transition: all $transition-normal;

  &:hover {
    .logo-svg,
    .logo-svg-small {
      transform: scale(1.05);
      transition: transform $transition-normal $ease-out-quart;
    }

    .logo-initials,
    .logo-name {
      color: var(--color-primary-light);
    }
  }
}

// Responsive adjustments
@media (max-width: $breakpoint-sm) {
  .personal-logo.size-lg {
    .logo-name {
      font-size: $font-size-md;
    }
    .logo-tagline {
      font-size: $font-size-sm;
    }
  }

  .personal-logo.size-xl {
    .logo-name {
      font-size: $font-size-lg;
    }
    .logo-tagline {
      font-size: $font-size-md;
    }
  }
}
</style>
