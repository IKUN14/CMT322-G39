import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest, ForgotPasswordRequest } from '@/types'
import { UserRole } from '@/types'
import { authApi } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const role = computed(() => user.value?.role || null)
  const isStudent = computed(() => role.value === UserRole.Student)
  const isAdmin = computed(() => role.value === UserRole.Admin)
  const isWorker = computed(() => role.value === UserRole.Worker)

  async function login(data: LoginRequest) {
    try {
      const response = await authApi.login(data)
      user.value = response.user
      token.value = response.token
      return response
    } catch (error) {
      throw error
    }
  }

  async function register(data: RegisterRequest) {
    try {
      const response = await authApi.register(data)
      user.value = response.user
      token.value = response.token
      return response
    } catch (error) {
      throw error
    }
  }

  async function forgotPassword(data: ForgotPasswordRequest) {
    try {
      return await authApi.forgotPassword(data)
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      await authApi.logout()
      user.value = null
      token.value = null
    } catch (error) {
      throw error
    }
  }

  async function fetchCurrentUser() {
    try {
      const currentUser = await authApi.getCurrentUser()
      if (currentUser) {
        user.value = currentUser
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    role,
    isStudent,
    isAdmin,
    isWorker,
    login,
    register,
    forgotPassword,
    logout,
    fetchCurrentUser
  }
})
