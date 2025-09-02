declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, ...args: unknown[]) => string
    $route: import('vue-router').RouteLocationNormalized
    $router: import('vue-router').Router
  }
}

export {}
