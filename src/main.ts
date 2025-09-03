import './assets/styles/global.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { injectAccessibilityStyles } from './composables/useAccessibility'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

// Inject accessibility styles
injectAccessibilityStyles()

// Setup global error handler after app is created
import('./composables/useErrorHandler').then(({ setupGlobalErrorHandler }) => {
  setupGlobalErrorHandler()
})

app.mount('#app')
