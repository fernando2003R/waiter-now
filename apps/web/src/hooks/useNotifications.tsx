import { useState, useEffect, useCallback } from 'react'
import { formatCOP } from '../utils/currency'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
}

interface NotificationSettings {
  newOrders: boolean
  lowStock: boolean
  dailyReports: boolean
  email: boolean
  sms: boolean
  push: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    newOrders: true,
    lowStock: true,
    dailyReports: false,
    email: true,
    sms: false,
    push: true
  })
  const [loading, setLoading] = useState(false)

  // Datos de ejemplo para desarrollo
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Nuevo pedido recibido',
      message: `Mesa 5 ha realizado un nuevo pedido por ${formatCOP(45500)}`,
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5 minutos atrás
    },
    {
      id: '2',
      title: 'Stock bajo',
      message: 'Quedan solo 3 unidades de Hamburguesa Clásica',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutos atrás
    },
    {
      id: '3',
      title: 'Pedido completado',
      message: 'El pedido #1234 ha sido entregado exitosamente',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutos atrás
    },
    {
      id: '4',
      title: 'Error en el pago',
      message: 'El pago del pedido #1235 ha sido rechazado',
      type: 'error',
      read: false,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutos atrás
    },
    {
      id: '5',
      title: 'Reporte diario disponible',
      message: 'Tu reporte de ventas del día está listo para revisar',
      type: 'info',
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 horas atrás
    }
  ]

  // Cargar notificaciones
  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      // Por ahora usamos datos mock, pero aquí se haría la llamada a la API
      // const response = await notificationsAPI.getNotifications()
      // setNotifications(response.data)
      
      // Simulamos una llamada a la API
      await new Promise(resolve => setTimeout(resolve, 500))
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // En caso de error, usamos los datos mock
      setNotifications(mockNotifications)
    } finally {
      setLoading(false)
    }
  }, [])

  // Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // await notificationsAPI.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      // await notificationsAPI.markAllAsRead()
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [])

  // Actualizar configuración de notificaciones
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      // await notificationsAPI.updateSettings(newSettings)
      setSettings(prev => ({ ...prev, ...newSettings }))
    } catch (error) {
      console.error('Error updating notification settings:', error)
    }
  }, [])

  // Agregar nueva notificación (para notificaciones en tiempo real)
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  // Eliminar notificación
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }, [])

  // Calcular notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Simular notificaciones en tiempo real (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular una nueva notificación cada 2 minutos (solo para demo)
      if (Math.random() > 0.95) { // 5% de probabilidad cada 30 segundos
        const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error']
        const messages = [
          { title: 'Nuevo pedido', message: 'Se ha recibido un nuevo pedido' },
          { title: 'Pedido completado', message: 'Un pedido ha sido completado' },
          { title: 'Stock bajo', message: 'Un producto tiene stock bajo' },
          { title: 'Error de sistema', message: 'Se ha detectado un error' }
        ]
        
        const randomType = types[Math.floor(Math.random() * types.length)]
        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        
        addNotification({
          ...randomMessage,
          type: randomType,
          read: false,
          createdAt: new Date().toISOString()
        })
      }
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [addNotification])

  return {
    notifications,
    settings,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    updateSettings,
    addNotification,
    removeNotification
  }
}