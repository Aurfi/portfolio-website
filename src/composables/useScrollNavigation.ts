import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export interface NavigationSection {
  id: string
  name: string
  translationKey: string
}

export function useScrollNavigation(sections: NavigationSection[]) {
  const route = useRoute()
  const activeSection = ref<string>('')
  const observer = ref<IntersectionObserver | null>(null)

  // Simple scroll to section using native browser behavior
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (!element) return

    // Use native smooth scrolling - simple and reliable
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  // Simple intersection observer for active section detection
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        activeSection.value = entry.target.id
        break
      }
    }
  }

  // Initialize intersection observer
  const initializeObserver = () => {
    if (observer.value) {
      observer.value.disconnect()
    }

    observer.value = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0.5],
    })

    // Observe sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element && observer.value) {
        observer.value.observe(element)
      }
    })
  }

  // Cleanup
  const cleanup = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
  }

  onMounted(() => {
    // Set initial active section from URL hash
    const hash = route.hash.slice(1)
    if (hash && sections.some((s) => s.id === hash)) {
      activeSection.value = hash
    } else if (sections.length > 0) {
      activeSection.value = sections[0].id
    }

    initializeObserver()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    activeSection,
    scrollToSection,
    initializeObserver,
    cleanup,
  }
}
