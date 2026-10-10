import axios from 'axios'

export const TOKEN_KEY = 'fastor_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://staging.fastor.ai',
  timeout: 15000,
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const path = window.location.pathname
      if (localStorage.getItem(TOKEN_KEY) && path !== '/signup' && path !== '/otp') {
        localStorage.removeItem(TOKEN_KEY)
        window.location.assign('/signup')
      }
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown; error?: unknown } | undefined
    if (typeof data?.message === 'string' && data.message) return data.message
    if (typeof data?.error === 'string' && data.error) return data.error
    if (error.code === 'ERR_NETWORK') return 'Network error. Please check your connection.'
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.'
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}