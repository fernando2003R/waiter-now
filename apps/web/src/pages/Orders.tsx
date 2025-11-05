import { useState, useEffect } from 'react'
import { Search, Clock, CheckCircle, XCircle, Package, Phone } from 'lucide-react'
import { API_URL, DEFAULT_HEADERS } from '../config/api'

// Función para formatear moneda en pesos colombianos
const formatCOP = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface OrderItem {
  id: string
  name: string
  description?: string
  quantity: number
  price: number
  notes?: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  customerName: string
  customerPhone?: string
  restaurant: {
    name: string
    phone?: string
    email?: string
  }
  table?: {
    id: string
    number: number
    name?: string
    section?: string
  }
  items: OrderItem[]
  notes?: string
  estimatedTime?: string
  completedAt?: string
  createdAt: string
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'warning',
    icon: Clock,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200'
  },
  confirmed: {
    label: 'Confirmado',
    color: 'primary',
    icon: CheckCircle,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  preparing: {
    label: 'Preparando',
    color: 'info',
    icon: Package,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  },
  ready: {
    label: 'Listo',
    color: 'success',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  delivered: {
    label: 'Entregado',
    color: 'success',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'error',
    icon: XCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  }
}

interface OrderCardProps {
  order: Order
  onUpdateStatus: (orderId: string, newStatus: string) => void
  isUpdating: boolean
}

function OrderCard({ order, onUpdateStatus, isUpdating }: OrderCardProps) {
  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = status.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${status.borderColor} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${status.bgColor}`}>
            <StatusIcon className={`h-5 w-5 ${status.textColor}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
            <p className="text-sm text-gray-600">{order.customerName}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
          {status.label}
        </span>
      </div>

      {/* Información del pedido */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Restaurante:</span>
          <span className="font-medium text-sm">{order.restaurant.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Mesa:</span>
          <span className="font-medium">Mesa {order.table?.number || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Fecha:</span>
          <span className="font-medium text-sm">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total:</span>
          <span className="font-bold text-lg">{formatCOP(order.total)}</span>
        </div>
      </div>

      {/* Items del pedido */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Artículos:</h4>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium">{formatCOP(item.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Información de contacto */}
      {(order.customerPhone || order.restaurant.phone) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Contacto:</h4>
          <div className="space-y-1">
            {order.customerPhone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>Cliente: {order.customerPhone}</span>
              </div>
            )}
            {order.restaurant.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>Restaurante: {order.restaurant.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'confirmed')}
              disabled={isUpdating}
              className="flex-1 min-w-0 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Actualizando...' : 'Confirmar Pedido'}
            </button>
          )}
          
          {order.status === 'confirmed' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'preparing')}
              disabled={isUpdating}
              className="flex-1 min-w-0 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Actualizando...' : 'Empezar a Preparar'}
            </button>
          )}
          
          {order.status === 'preparing' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'ready')}
              disabled={isUpdating}
              className="flex-1 min-w-0 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Actualizando...' : 'Finalizar Preparación'}
            </button>
          )}
          
          {order.status === 'ready' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              disabled={isUpdating}
              className="flex-1 min-w-0 px-3 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Actualizando...' : 'Entregar'}
            </button>
          )}
          
          {(order.status === 'pending' || order.status === 'confirmed') && (
            <button
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
              disabled={isUpdating}
              className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Cancelando...' : 'Cancelar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar los pedidos')
      }

      const data = await response.json()
      
      // La API devuelve { success, message, data: { orders: [...], pagination: {...} } }
      if (data.success && data.data && Array.isArray(data.data.orders)) {
        setOrders(data.data.orders)
      } else {
        throw new Error('Formato de respuesta inválido')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId)
      const token = localStorage.getItem('token')
      
      const updateData = {
        status: newStatus,
        ...(newStatus === 'confirmed' && {
          estimatedTime: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutos
        })
      }

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        // Actualizar la orden en el estado local
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus as any, estimatedTime: updateData.estimatedTime }
              : order
          )
        )
      } else {
        alert(`Error al actualizar el pedido: ${result.message}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error al actualizar el estado del pedido')
    } finally {
      setUpdatingOrder(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const ordersByStatus = {
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
    preparing: filteredOrders.filter(o => o.status === 'preparing').length,
    ready: filteredOrders.filter(o => o.status === 'ready').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <XCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 text-sm text-red-800 underline hover:text-red-900"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-gray-600">Revisa el estado de todos tus pedidos</p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{ordersByStatus.pending}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{ordersByStatus.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmados</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{ordersByStatus.preparing}</div>
          <div className="text-sm text-gray-600">Preparando</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{ordersByStatus.ready}</div>
          <div className="text-sm text-gray-600">Listos</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{ordersByStatus.delivered}</div>
          <div className="text-sm text-gray-600">Entregados</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{ordersByStatus.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelados</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, número de pedido o restaurante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmados</option>
              <option value="preparing">Preparando</option>
              <option value="ready">Listos</option>
              <option value="delivered">Entregados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onUpdateStatus={updateOrderStatus}
            isUpdating={updatingOrder === order.id}
          />
        ))}
      </div>

      {/* Estado vacío */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron pedidos
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Aún no has realizado ningún pedido'
            }
          </p>
        </div>
      )}
    </div>
  )
}