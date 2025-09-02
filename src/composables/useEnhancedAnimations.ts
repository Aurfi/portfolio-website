import { onMounted, onUnmounted, ref } from 'vue'

interface AnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
  delay?: number
}

export function useEnhancedAnimations() {
  const observer = ref<IntersectionObserver | null>(null)
  const animatedElements = ref<Set<Element>>(new Set())

  const initializeAnimations = (options: AnimationOptions = {}) => {
    const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', once = true, delay = 0 } = options

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      // Skip animations for users who prefer reduced motion
      const elements = document.querySelectorAll('[data-animate]')
      elements.forEach((el) => {
        el.classList.add('animate-complete')
      })
      return
    }

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const animationType = element.dataset.animate || 'fade-in-up'
            const animationDelay = element.dataset.delay || delay.toString()

            // Add animation delay if specified
            if (animationDelay && parseInt(animationDelay) > 0) {
              setTimeout(() => {
                triggerAnimation(element, animationType)
              }, parseInt(animationDelay))
            } else {
              triggerAnimation(element, animationType)
            }

            if (once) {
              observer.value?.unobserve(element)
            }
            animatedElements.value.add(element)
          } else if (!once) {
            // Reset animation if not 'once' and element is out of view
            const element = entry.target as HTMLElement
            resetAnimation(element)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    // Observe all elements with data-animate attribute
    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach((el) => observer.value?.observe(el))
  }

  const triggerAnimation = (element: HTMLElement, animationType: string) => {
    // Remove any existing animation classes
    element.classList.remove(
      'animate-fade-in',
      'animate-fade-in-up',
      'animate-fade-in-down',
      'animate-fade-in-left',
      'animate-fade-in-right',
      'animate-scale-in'
    )

    // Add the appropriate animation class
    element.classList.add(`animate-${animationType}`)

    // Mark as animated
    element.setAttribute('data-animated', 'true')

    // Send animation event to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'animation_triggered', {
        event_category: 'User Interaction',
        event_label: animationType,
        value: 1,
      })
    }
  }

  const resetAnimation = (element: HTMLElement) => {
    element.classList.remove(
      'animate-fade-in',
      'animate-fade-in-up',
      'animate-fade-in-down',
      'animate-fade-in-left',
      'animate-fade-in-right',
      'animate-scale-in'
    )
    element.removeAttribute('data-animated')
  }

  const addStaggeredAnimation = (
    selector: string,
    animationType: string = 'fade-in-up',
    staggerDelay: number = 100
  ) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el, index) => {
      const element = el as HTMLElement
      element.setAttribute('data-animate', animationType)
      element.setAttribute('data-delay', (index * staggerDelay).toString())
    })
  }

  const addHoverEffects = () => {
    // Add enhanced hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, .btn, .card, .project-card, a[href]'
    )

    interactiveElements.forEach((el) => {
      const element = el as HTMLElement

      // Skip if already has hover effect
      if (element.classList.contains('hover-enhanced')) return

      element.classList.add('hover-enhanced')

      element.addEventListener('mouseenter', () => {
        if (
          !element.classList.contains('hover-lift') &&
          !element.classList.contains('hover-scale') &&
          !element.classList.contains('hover-glow')
        ) {
          element.classList.add('hover-lift')
        }
      })

      element.addEventListener('mouseleave', () => {
        // Remove temporary hover classes
        element.classList.remove('hover-lift')
      })
    })
  }

  const addParallaxEffect = (selector: string, speed: number = 0.5) => {
    const elements = document.querySelectorAll(selector)

    const handleScroll = () => {
      const scrolled = window.pageYOffset

      elements.forEach((el) => {
        const element = el as HTMLElement
        const rate = scrolled * -speed
        element.style.transform = `translateY(${rate}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }

  const addMagneticEffect = (selector: string) => {
    const elements = document.querySelectorAll(selector)

    elements.forEach((el) => {
      const element = el as HTMLElement

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        const moveX = x * 0.1
        const moveY = y * 0.1

        element.style.transform = `translate(${moveX}px, ${moveY}px)`
      })

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px)'
      })
    })
  }

  const cleanup = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
    animatedElements.value.clear()
  }

  onMounted(() => {
    // Initialize with a small delay to ensure DOM is ready
    setTimeout(() => {
      initializeAnimations()
      addHoverEffects()
    }, 100)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    initializeAnimations,
    addStaggeredAnimation,
    addHoverEffects,
    addParallaxEffect,
    addMagneticEffect,
    triggerAnimation,
    resetAnimation,
    cleanup,
  }
}

// Utility function to add animation attributes to elements
export function addAnimationAttributes(
  element: HTMLElement,
  animationType: string = 'fade-in-up',
  delay: number = 0
) {
  element.setAttribute('data-animate', animationType)
  if (delay > 0) {
    element.setAttribute('data-delay', delay.toString())
  }
}

// Utility function for manual animation triggering
export function animateElement(element: HTMLElement, animationType: string = 'fade-in-up') {
  element.classList.add(`animate-${animationType}`)
}
