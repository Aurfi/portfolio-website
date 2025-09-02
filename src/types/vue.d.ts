import type { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, ...args: any[]) => string
    $route: import('vue-router').RouteLocationNormalized
    $router: import('vue-router').Router
  }
}

export {}
