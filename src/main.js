import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useMainStore } from '@/stores/main.js'
import { useAuthStore } from '@/stores/auth.js'

import './css/main.css'

// Create router plugin to make router available in stores
const routerPlugin = {
  install(app, options) {
    app.config.globalProperties.$router = options.router
    app.provide('router', options.router)
  }
}

// Init Pinia
const pinia = createPinia()

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)
app.use(routerPlugin, { router })

// Mount app
app.mount('#app')

// Init main store
const mainStore = useMainStore(pinia)

// Init auth store and initialize authentication
const authStore = useAuthStore(pinia)
authStore.initializeAuth()

// Fetch sample data
mainStore.fetchSampleClients()
mainStore.fetchSampleHistory()

// Dark mode
// Uncomment, if you'd like to restore persisted darkMode setting, or use `prefers-color-scheme: dark`.  Make sure to uncomment localStorage block in src/stores/darkMode.js
// import { useDarkModeStore } from './stores/darkMode'

// const darkModeStore = useDarkModeStore(pinia)

// if (
//   (! localStorage['darkMode'] && window.matchMedia('(prefers-color-scheme: dark)'). matches) ||
//   localStorage['darkMode'] === '1'
// ) {
//   darkModeStore.set(true)
// }

// Default title tag
const defaultDocumentTitle = 'Facebook Crawler Admin'

// Set document title from route meta
router.afterEach((to) => {
  document.title = to. meta?. title
    ? `${to.meta. title} — ${defaultDocumentTitle}`
    : defaultDocumentTitle
})