// import { defineStore } from 'pinia'
// import api from '@/utils/axios'

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     user: null,
//     accessToken: null,
//     refreshToken: null,
//     isAuthenticated: false,
//     isLoading: false
//   }),

//   getters: {
//     getUser: (state) => state.user,
//     getAccessToken: (state) => state.accessToken,
//     isLoggedIn: (state) => state.isAuthenticated
//   },

//   actions: {
//     // Login action
//     async login(credentials) {
//       this.isLoading = true
//       try {
//         // Using your configured api instance - will call: http://127.0.0.1:8000/api/auth/login/
//         const response = await api.post('auth/login/', {
//           email: credentials.username,
//           password: credentials.password
//         })

//         const { accessToken, refreshToken, user } = response.data
        
//         this.setTokens(accessToken, refreshToken)
//         this.user = user
//         this.isAuthenticated = true
        
//         // Store tokens securely
//         this.storeTokens(accessToken, refreshToken)
        
//         return { success: true, user }
//       } catch (error) {
//         this.clearAuth()
//         return { 
//           success: false, 
//           message: error.response?.data?.message || 'Login failed' 
//         }
//       } finally {
//         this.isLoading = false
//       }
//     },

//     // Logout action
//     async logout() {
//       try {
//         // Call logout API if needed - using configured api instance
//         await api.post('auth/logout/', {
//           refreshToken: this.refreshToken
//         })
//       } catch (error) {
//         console.error('Logout API error:', error)
//       } finally {
//         this.clearAuth()
//       }
//     },

//     // Refresh token action
//     async refreshAccessToken() {
//       try {
//         const response = await api.post('auth/refresh/', {
//           refreshToken: this.refreshToken
//         })

//         const { accessToken } = response.data
//         this.accessToken = accessToken
//         localStorage.setItem('accessToken', accessToken)
        
//         return true
//       } catch (error) {
//         this.clearAuth()
//         return false
//       }
//     },

//     // Set tokens
//     setTokens(accessToken, refreshToken) {
//       this.accessToken = accessToken
//       this.refreshToken = refreshToken
//     },

//     // Store tokens (consider security implications)
//     storeTokens(accessToken, refreshToken) {
//       // Option 1: localStorage (less secure but persistent)
//       localStorage.setItem('accessToken', accessToken)
//       localStorage.setItem('refreshToken', refreshToken)
      
//       // Option 2: sessionStorage (more secure, not persistent)
//       // sessionStorage.setItem('accessToken', accessToken)
//       // sessionStorage.setItem('refreshToken', refreshToken)
      
//       // Option 3: HTTP-only cookies (most secure, requires backend support)
//       // Tokens would be stored automatically in HTTP-only cookies
//     },

//     // Initialize auth from stored tokens
//     initializeAuth() {
//       const accessToken = localStorage.getItem('accessToken')
//       const refreshToken = localStorage.getItem('refreshToken')
      
//       if (accessToken && refreshToken) {
//         this.setTokens(accessToken, refreshToken)
//         this.isAuthenticated = true
//         // Optionally verify token validity
//         this.verifyToken()
//       }
//     },

//     // Verify token validity
//     async verifyToken() {
//       try {
//         const response = await api.get('auth/verify/')
//         this.user = response.data.user
//         this.isAuthenticated = true
//       } catch (error) {
//         this.clearAuth()
//       }
//     },

//     // Clear authentication
//     clearAuth() {
//       this.user = null
//       this.accessToken = null
//       this.refreshToken = null
//       this.isAuthenticated = false
      
//       // Clear stored tokens
//       localStorage.removeItem('accessToken')
//       localStorage.removeItem('refreshToken')
//       // sessionStorage.clear()
//     }
//   }
// })

import { defineStore } from 'pinia'
import api from '@/utils/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    isLoggingOut: false
  }),

  getters: {
    getUser: (state) => state. user,
    getAccessToken: (state) => state.accessToken,
    isLoggedIn: (state) => state. isAuthenticated
  },

  actions: {
    // Login action
    async login(credentials) {
      this.isLoading = true
      try {
        const response = await api.post('auth/login/', {
          email: credentials.username,
          password: credentials.password
        })

        const { accessToken, refreshToken, user } = response. data
        
        this. setTokens(accessToken, refreshToken)
        this.user = user
        this.isAuthenticated = true
        
        this. storeTokens(accessToken, refreshToken)
        
        return { success: true, user }
      } catch (error) {
        this.clearAuth()
        return { 
          success: false, 
          message: error.response?. data?.message || 'Login failed' 
        }
      } finally {
        this.isLoading = false
      }
    },

    // Fixed Logout action
    async logout() {
      if (this.isLoggingOut) return
      
      this. isLoggingOut = true
      
      try {
        if (this.accessToken) {
          await api.post('auth/logout/', {
            refresh_token: this. refreshToken,
          }, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          })
        }
        
        console.log('Logout API call successful')
        
      } catch (error) {
        console. error('Logout API error:', error)
      } finally {
        // Always clear auth data
        this.clearAuth()
        this.isLoggingOut = false
        
        // Use window.location for reliable redirect
        window.location.href = '/login'
      }
    },

    // Refresh token action
    async refreshAccessToken() {
      try {
        const response = await api. post('auth/refresh/', {
          refreshToken: this.refreshToken
        })

        const { accessToken } = response.data
        this.accessToken = accessToken
        localStorage.setItem('accessToken', accessToken)
        
        return true
      } catch (error) {
        this.clearAuth()
        return false
      }
    },

    // Set tokens
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken
      this. refreshToken = refreshToken
    },

    // Store tokens
    storeTokens(accessToken, refreshToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      if (this.user) {
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    // Initialize auth from stored tokens
    initializeAuth() {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage. getItem('user')
      
      if (accessToken && refreshToken) {
        this.setTokens(accessToken, refreshToken)
        this. isAuthenticated = true
        
        if (storedUser) {
          try {
            this. user = JSON.parse(storedUser)
          } catch (error) {
            console.error('Failed to parse stored user data:', error)
          }
        }
        
        this.verifyToken()
      }
    },

    // Verify token validity
    async verifyToken() {
      try {
        const response = await api.get('auth/verify/')
        this.user = response.data. user
        this. isAuthenticated = true
        
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Token verification failed:', error)
        this.clearAuth()
      }
    },

    // Clear authentication
    clearAuth() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      
      // Clear all stored auth data
      localStorage. removeItem('accessToken')
      localStorage. removeItem('refreshToken')
      localStorage. removeItem('user')
      localStorage.removeItem('jwt')
      localStorage.removeItem('token')
    },

    // Quick logout without API call
    quickLogout() {
      this.clearAuth()
      window. location.href = '/login'
    }
  }
})