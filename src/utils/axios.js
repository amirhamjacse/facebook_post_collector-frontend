import axios from 'axios'

// Create axios instance - Use import.meta.env instead of process.env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage directly to avoid circular dependency issues
    const token = localStorage.getItem('accessToken')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Clear auth and redirect to login
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      
      // Redirect to login
      window.location.href = '/login'
      
      return Promise.reject(error)
    }
    
    return Promise.reject(error)
  }
)

export default api