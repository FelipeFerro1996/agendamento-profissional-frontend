import { ref } from 'vue'
import { api } from 'boot/axios'
import axios from 'axios'
import { useApi } from './useApi'
import { type AuthResponse } from 'src/types/auth'

interface User {
  id: number
  name: string
  email: string
}

const user = ref<User | null>(null)
const { post } = useApi()

export function useAuth() {

  const login = async (email: string, password: string) => {
    // const { data } = await api.post('/login', { email, password })
    const login = await post<AuthResponse>('/login', { email, password })

    localStorage.setItem('token', login.token)
    user.value = login.user
  }

  const fetchUser = async () => {
    try {
        const { data } = await api.get('/me')
        user.value = data
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
        void logout()
        }
    }
  }

  const logout = async () => {
    try {
        await api.post('/logout')
    } catch {
        // ignora erro
    }

    localStorage.removeItem('token')
    user.value = null
  }

  const isAuthenticated = () => !!user.value

  return {
    user,
    login,
    logout,
    fetchUser,
    isAuthenticated
  }
}