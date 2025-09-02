import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { i18n } from '@/i18n'
import type { SupportedLocale } from '@/types'

// Import views
import HomeView from '@/views/HomeView.vue'

// Define routes with proper typing
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'navigation.home',
      requiresAuth: false,
    },
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: {
      title: 'navigation.projects',
      requiresAuth: false,
    },
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: {
      title: 'projects.title',
      requiresAuth: false,
    },
    props: true,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'navigation.about',
      requiresAuth: false,
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      title: 'navigation.contact',
      requiresAuth: false,
    },
  },
  // 404 Error page
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'common.error',
      requiresAuth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return saved position if available (browser back/forward)
    if (savedPosition) {
      return new Promise((resolve) => {
        // Add small delay for better UX
        setTimeout(() => {
          resolve({
            ...savedPosition,
            behavior: 'smooth',
          })
        }, 50)
      })
    }

    // Handle hash navigation for sections
    if (to.hash) {
      return new Promise((resolve) => {
        // Wait for DOM to be ready and components to mount
        const waitForElement = (attempts = 0) => {
          const element = document.querySelector(to.hash)

          if (element || attempts > 20) {
            // Max 2 seconds wait
            const headerOffset = 80
            const elementTop = element
              ? element.getBoundingClientRect().top + window.pageYOffset - headerOffset
              : 0

            resolve({
              top: elementTop,
              behavior: 'smooth',
            })
          } else {
            setTimeout(() => waitForElement(attempts + 1), 100)
          }
        }

        waitForElement()
      })
    }

    // Scroll to top for new routes (but not for same route with different hash)
    if (to.path !== from.path) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ top: 0, behavior: 'smooth' })
        }, 50)
      })
    }

    // Don't scroll if staying on same route without hash change
    return false
  },
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Set document title based on route meta
  if (to.meta.title) {
    const title = i18n.global.t(to.meta.title as string)
    document.title = `${title} | Portfolio`
  }

  // Handle language persistence
  const currentLocale = i18n.global.locale.value as SupportedLocale
  document.documentElement.lang = currentLocale

  next()
})

// Handle route errors
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
