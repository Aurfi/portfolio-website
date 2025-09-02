import './assets/styles/global.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import { injectAccessibilityStyles } from './composables/useAccessibility'
import { setupGlobalErrorHandler } from './composables/useErrorHandler'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

// Inject accessibility styles
injectAccessibilityStyles()

// Setup global error handler
setupGlobalErrorHandler()

app.mount('#app')
