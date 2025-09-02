import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  const observer = ref<IntersectionObserver | null>(null)
  const revealedElements = ref(new Set<Element>())

  const initScrollReveal = () => {
    if (typeof window === 'undefined') return

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            revealedElements.value.add(entry.target)
            // Stop observing once revealed
            observer.value?.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    // Observe all elements with reveal-on-scroll class
    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => {
      observer.value?.observe(el)
    })
  }

  const addRevealElement = (element: Element) => {
    if (observer.value && !revealedElements.value.has(element)) {
      observer.value.observe(element)
    }
  }

  const removeRevealElement = (element: Element) => {
    if (observer.value) {
      observer.value.unobserve(element)
      revealedElements.value.delete(element)
    }
  }

  const cleanup = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
    revealedElements.value.clear()
  }

  onMounted(() => {
    // Delay initialization to ensure DOM is ready
    setTimeout(initScrollReveal, 100)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    addRevealElement,
    removeRevealElement,
    cleanup,
  }
}
