import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Style from '@/views/StyleView.vue'
import Home from '@/views/HomeView.vue'

const routes = [    
  // {
  //   meta: {
  //     title: 'Select style',
  //     requiresAuth: false
  //   },
  //   path: '/',
  //   name: 'style',
  //   component: Style,
  // },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard',
      requiresAuth: true // Protected route
    },
    path: '/',
    name: 'dashboard',
    component: Home,
  },
  {
    meta: {
      title: 'Tables',
      requiresAuth: true // Protected route
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue'),
  },
  {
    meta: {
      title: 'Forms',
      requiresAuth: true // Protected route
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue'),
  },
  {
    meta: {
      title: 'Profile',
      requiresAuth: true // Protected route
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
  },
  {
    meta: {
      title: 'Ui',
      requiresAuth: true // Protected route
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue'),
  },
  {
    meta: {
      title: 'Responsive layout',
      requiresAuth: true // Protected route
    },
    path: '/responsive',
    name: 'responsive',
    component: () => import('@/views/ResponsiveView.vue'),
  },
  {
    meta: {
      title: 'Login',
      requiresAuth: false, // Public route
      hideForAuth: true // Hide this route if user is already authenticated
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    meta: {
      title: 'Error',
      requiresAuth: false // Public route
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue'),
  },
  // Catch-all route for 404 errors
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/error'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

// Navigation guards for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Check if route should be hidden for authenticated users
  const hideForAuth = to.matched.some(record => record.meta.hideForAuth)
  
  // Initialize auth store if not already done (for page refresh scenarios)
  if (!authStore.isAuthenticated && (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'))) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      authStore.clearAuth()
    }
  }
  
  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Store the intended route to redirect after login
      localStorage.setItem('redirectAfterLogin', to.fullPath)
      next('/login')
      return
    }
    
    // Optional: Verify token is still valid before accessing protected routes
    try {
      if (authStore.accessToken) {
        // You could add a token validation check here if needed
        // await authStore.verifyToken()
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      authStore.clearAuth()
      next('/login')
      return
    }
  }
  
  if (hideForAuth && authStore.isAuthenticated) {
    // Check if there's a stored redirect path
    const redirectPath = localStorage.getItem('redirectAfterLogin')
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin')
      next(redirectPath)
      return
    }
    // Default redirect to dashboard for authenticated users trying to access login
    next('/')
    return
  }
  
  next()
})

// Optional: Add navigation guard to handle authentication errors globally
router.onError((error) => {
  console.error('Router error:', error)
  
  // Handle authentication errors
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    const authStore = useAuthStore()
    authStore.clearAuth()
    router.push('/login')
  }
})

export default router