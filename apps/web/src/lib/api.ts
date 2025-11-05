import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { API_URL, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '@/config/api'

// API Configuration
const API_BASE_URL = API_URL

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Types
export interface User {
  id: string
  name: string
  email: string
  role: string
  restaurantId: string
  avatar?: string
}

export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  website?: string
  cuisine: string
  priceRange: string
  capacity: number
  openingHours: Record<string, { open: string; close: string; closed: boolean }>
  logo?: string
  coverImage?: string
  rating: number
  reviewCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  ingredients: string[]
  allergens: string[]
  isAvailable: boolean
  preparationTime: number
  calories?: number
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  tableNumber?: number
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  total: number
  notes?: string
  estimatedTime?: number
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  menuItemId: string
  menuItem: MenuItem
  quantity: number
  price: number
  notes?: string
}

export interface Analytics {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  averageOrderTime: number
  averageRating: number
  mostPopularDish: string
  peakHours: string
  salesByDay: Array<{ date: string; sales: number }>
  salesByCategory: Array<{ category: string; sales: number }>
  ordersByStatus: Array<{ status: string; count: number }>
}

export interface Table {
  id: string
  number: string
  name?: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
  section?: string
  positionX: number
  positionY: number
  notes?: string
  restaurantId: string
  currentOrderId?: string
  createdAt: string
  updatedAt: string
}

export interface TableReservation {
  id: string
  tableId: string
  table: Table
  userId: string
  user: User
  customerName: string
  customerPhone: string
  customerEmail?: string
  partySize: number
  reservationDate: string
  reservationTime: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', { email, password })
    return response.data.data // El backend devuelve { success, message, data: { user, token } }
  },

  loginWithGoogle: async (token: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/google', { token })
    return response.data.data // El backend devuelve { success, message, data: { user, token } }
  },

  register: async (data: {
    name: string
    email: string
    password: string
    phone?: string
  }): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', data)
    return response.data.data // El backend devuelve { success, message, data: { user, token } }
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  me: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put('/auth/change-password', { currentPassword, newPassword })
  },
}

// Restaurant API
export const restaurantAPI = {
  createRestaurant: async (data: {
    name: string
    description?: string
    address: string
    phone: string
    email: string
    cuisine?: string
    priceRange?: string
    openingHours?: Record<string, { open: string; close: string; closed: boolean }>
  }): Promise<Restaurant> => {
    const response = await api.post('/restaurants', data)
    return response.data.data
  },

  getRestaurants: async (params?: {
    search?: string
    cuisine?: string
    priceRange?: string
    page?: number
    limit?: number
  }): Promise<{ restaurants: Restaurant[]; pagination: any }> => {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.cuisine) queryParams.append('cuisine', params.cuisine)
    if (params?.priceRange) queryParams.append('priceRange', params.priceRange)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await api.get(`/restaurants?${queryParams}`)
    return response.data.data
  },

  getRestaurant: async (id: string): Promise<Restaurant> => {
    const response = await api.get(`/restaurants/${id}`)
    return response.data.data
  },
}

// Restaurant Management API (for restaurant owners)
export const restaurantManagementAPI = {
  get: async (): Promise<Restaurant> => {
    const response = await api.get('/restaurant')
    return response.data
  },

  update: async (data: Partial<Restaurant>): Promise<Restaurant> => {
    const response = await api.put('/restaurant', data)
    return response.data
  },

  uploadLogo: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('logo', file)
    const response = await api.post('/restaurant/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  uploadCoverImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('coverImage', file)
    const response = await api.post('/restaurant/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },
}

// Menu API
export const menuAPI = {
  getItems: async (): Promise<MenuItem[]> => {
    const response = await api.get('/menu/items')
    return response.data
  },

  getItem: async (id: string): Promise<MenuItem> => {
    const response = await api.get(`/menu/items/${id}`)
    return response.data
  },

  createItem: async (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> => {
    const response = await api.post('/menu/items', data)
    return response.data
  },

  updateItem: async (id: string, data: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await api.put(`/menu/items/${id}`, data)
    return response.data
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/menu/items/${id}`)
  },

  uploadItemImage: async (id: string, file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('image', file)
    const response = await api.post(`/menu/items/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/menu/categories')
    return response.data
  },
}

// Orders API
export const ordersAPI = {
  getOrders: async (params?: {
    status?: string
    page?: number
    limit?: number
    search?: string
  }): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> => {
    const response = await api.get('/orders', { params })
    return response.data
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  },

  updateEstimatedTime: async (id: string, estimatedTime: number): Promise<Order> => {
    const response = await api.put(`/orders/${id}/estimated-time`, { estimatedTime })
    return response.data
  },

  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/cancel`, { reason })
    return response.data
  },
}

// Analytics API
export const analyticsAPI = {
  getDashboard: async (period?: string): Promise<Analytics> => {
    const response = await api.get('/analytics/dashboard', { params: { period } })
    return response.data
  },

  getSalesReport: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get('/analytics/sales', {
      params: { startDate, endDate }
    })
    return response.data
  },

  getPopularItems: async (period?: string): Promise<Array<{ item: MenuItem; orderCount: number }>> => {
    const response = await api.get('/analytics/popular-items', { params: { period } })
    return response.data
  },

  getCustomerInsights: async (period?: string): Promise<any> => {
    const response = await api.get('/analytics/customers', { params: { period } })
    return response.data
  },
}

// Notifications API
export const notificationsAPI = {
  getNotifications: async (): Promise<any[]> => {
    const response = await api.get('/notifications')
    return response.data
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`)
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all')
  },

  updateSettings: async (settings: any): Promise<void> => {
    await api.put('/notifications/settings', settings)
  },
}

// QR Code API
export const qrAPI = {
  generateTableQR: async (tableNumber: number): Promise<{ qrCode: string; url: string }> => {
    const response = await api.post('/qr/table', { tableNumber })
    return response.data
  },

  generateMenuQR: async (): Promise<{ qrCode: string; url: string }> => {
    const response = await api.post('/qr/menu')
    return response.data
  },
}

// Tables API
export const tablesAPI = {
  getTables: async (restaurantId?: string): Promise<Table[]> => {
    const params = restaurantId ? { restaurantId } : {}
    const response = await api.get('/tables', { params })
    return response.data.data
  },

  getTable: async (id: string): Promise<Table> => {
    const response = await api.get(`/tables/${id}`)
    return response.data.data
  },

  createTable: async (data: {
    number: string
    name?: string
    capacity: number
    section?: string
    positionX: number
    positionY: number
    notes?: string
  }): Promise<Table> => {
    const response = await api.post('/tables', data)
    return response.data.data
  },

  updateTable: async (id: string, data: Partial<{
    number: number
    capacity: number
    status: string
    positionX: number
    positionY: number
  }>): Promise<Table> => {
    const response = await api.put(`/tables/${id}`, data)
    return response.data.data
  },

  deleteTable: async (id: string): Promise<void> => {
    await api.delete(`/tables/${id}`)
  },

  updateTableStatus: async (id: string, status: string): Promise<Table> => {
    const response = await api.patch(`/tables/${id}/status`, { status })
    return response.data.data
  },

  // Reservations
  getReservations: async (tableId?: string): Promise<TableReservation[]> => {
    const params = tableId ? { tableId } : {}
    const response = await api.get('/tables/reservations', { params })
    return response.data.data
  },

  createReservation: async (data: {
    tableId: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    partySize: number
    reservationDate: string
    reservationTime: string
    notes?: string
  }): Promise<TableReservation> => {
    const response = await api.post('/tables/reservations', data)
    return response.data.data
  },

  updateReservation: async (id: string, data: Partial<{
    customerName: string
    customerPhone: string
    customerEmail: string
    partySize: number
    reservationDate: string
    reservationTime: string
    status: string
    notes: string
  }>): Promise<TableReservation> => {
    const response = await api.put(`/tables/reservations/${id}`, data)
    return response.data.data
  },

  cancelReservation: async (id: string): Promise<void> => {
    await api.delete(`/tables/reservations/${id}`)
  },
}

export default api