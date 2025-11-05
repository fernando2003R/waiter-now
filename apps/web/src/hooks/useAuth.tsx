import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { authAPI, User } from '@/lib/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (token: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('user')
        
        if (token && savedUser) {
          setUser(JSON.parse(savedUser))
          // Verify token is still valid
          const currentUser = await authAPI.me()
          setUser(currentUser)
          localStorage.setItem('user', JSON.stringify(currentUser))
        }
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { user, token } = await authAPI.login(email, password)
      
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      toast.success(`¡Bienvenido, ${user.name}!`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (token: string) => {
    try {
      setIsLoading(true)
      const { user, token: authToken } = await authAPI.loginWithGoogle(token)
      
      localStorage.setItem('auth_token', authToken)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      toast.success(`¡Bienvenido, ${user.name}!`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión con Google'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true)
      const { user, token } = await authAPI.register(data)
      
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      toast.success(`¡Cuenta creada exitosamente! Bienvenido, ${user.name}`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al crear la cuenta'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Error during logout:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setUser(null)
      toast.success('Sesión cerrada exitosamente')
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/login'
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
}

export default useAuth