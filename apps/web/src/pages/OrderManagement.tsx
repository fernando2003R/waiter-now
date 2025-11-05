import React, { useState, useEffect } from 'react';
import { Clock, Phone, MapPin, CheckCircle, XCircle, Package, Search } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { API_URL, DEFAULT_HEADERS } from '../config/api';

// Función para formatear moneda en pesos colombianos
const formatCOP = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  customerName: string;
  customerPhone?: string;
  notes?: string;
  estimatedTime?: string;
  completedAt?: string;
  createdAt: string;
  restaurant: {
    name: string;
    phone: string;
    email: string;
  };
  table?: {
    id: string;
    number: number;
    name?: string;
    section?: string;
  };
  items: OrderItem[];
}

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    color: 'warning',
    icon: Clock,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200'
  },
  CONFIRMED: {
    label: 'Confirmado',
    color: 'primary',
    icon: CheckCircle,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  PREPARING: {
    label: 'Preparando',
    color: 'info',
    icon: Package,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  },
  READY: {
    label: 'Listo',
    color: 'success',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  DELIVERED: {
    label: 'Entregado',
    color: 'success',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'error',
    icon: XCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  }
};

interface OrderCardProps {
  order: Order
  onUpdateStatus: (orderId: string, newStatus: string) => void
  isUpdating: boolean
}

function OrderCard({ order, onUpdateStatus, isUpdating }: OrderCardProps) {
  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING
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

      {/* Notas de entrega */}
      {order.notes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Notas:</h4>
          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{order.notes}</span>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {order.status === 'PENDING' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'CONFIRMED')}
                disabled={isUpdating}
                className="flex-1 min-w-0 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Actualizando...' : 'Confirmar Pedido'}
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                disabled={isUpdating}
                className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Cancelando...' : 'Cancelar'}
              </button>
            </>
          )}
          
          {order.status === 'CONFIRMED' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'PREPARING')}
                disabled={isUpdating}
                className="flex-1 min-w-0 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Actualizando...' : 'Empezar a Preparar'}
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
                disabled={isUpdating}
                className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? 'Cancelando...' : 'Cancelar'}
              </button>
            </>
          )}
          
          {order.status === 'PREPARING' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'READY')}
              disabled={isUpdating}
              className="flex-1 min-w-0 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Actualizando...' : 'Finalizar Preparación'}
            </button>
          )}
          
          {order.status === 'READY' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'DELIVERED')}
              disabled={isUpdating}
              className="flex-1 min-w-0 px-3 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? 'Actualizando...' : 'Entregar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}



const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  // En una aplicación real, esto vendría del contexto de autenticación
  const restaurantId = 'cmhdib4in000arswjz53fse0a'; // Juan Valdez Café

  // WebSocket para notificaciones en tiempo real
  const { notifications, joinRestaurantRoom } = useWebSocket();

  // Unirse a la sala del restaurante para recibir notificaciones
  useEffect(() => {
    if (restaurantId) {
      joinRestaurantRoom(restaurantId);
    }
  }, [restaurantId, joinRestaurantRoom]);

  // Escuchar notificaciones de nuevos pedidos y actualizaciones
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.type === 'new_order' || notification.type === 'order_status_update') {
        // Actualizar la lista de pedidos cuando llegue una notificación
        fetchOrders();
      }
    });
  }, [notifications]);

  const statusOptions = [
    { value: 'all', label: 'Todos los pedidos', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDING', label: 'Pendientes', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'CONFIRMED', label: 'Confirmados', color: 'bg-blue-100 text-blue-800' },
    { value: 'PREPARING', label: 'Preparando', color: 'bg-orange-100 text-orange-800' },
    { value: 'READY', label: 'Listos', color: 'bg-green-100 text-green-800' },
    { value: 'DELIVERED', label: 'Entregados', color: 'bg-purple-100 text-purple-800' },
    { value: 'CANCELLED', label: 'Cancelados', color: 'bg-red-100 text-red-800' }
  ];

  // Filtrar pedidos por búsqueda y estado
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calcular estadísticas
  const stats = {
    pending: orders.filter(order => order.status === 'PENDING').length,
    confirmed: orders.filter(order => order.status === 'CONFIRMED').length,
    preparing: orders.filter(order => order.status === 'PREPARING').length,
    ready: orders.filter(order => order.status === 'READY').length,
    delivered: orders.filter(order => order.status === 'DELIVERED').length,
    cancelled: orders.filter(order => order.status === 'CANCELLED').length,
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const statusParam = selectedStatus === 'all' ? '' : `&status=${selectedStatus}`;
      const response = await fetch(`${API_URL}/orders?restaurantId=${restaurantId}${statusParam}`, {
        headers: DEFAULT_HEADERS
      });
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
      } else {
        setError(data.message || 'Error al cargar los pedidos');
      }
    } catch (err) {
      setError('Error de conexión al cargar los pedidos');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);
      
      const updateData = {
        status: newStatus,
        ...(newStatus === 'CONFIRMED' && {
          estimatedTime: new Date(Date.now() + 30 * 60000).toISOString() // 30 minutos
        })
      };

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          ...DEFAULT_HEADERS,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        // Actualizar la orden en el estado local
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, status: newStatus, estimatedTime: updateData.estimatedTime }
              : order
          )
        );
      } else {
        alert(`Error al actualizar el pedido: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido');
    } finally {
      setUpdatingOrder(null);
    }
  };



  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="mt-2 text-gray-600">Administra y actualiza el estado de los pedidos</p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-sm text-yellow-600">Pendientes</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{stats.confirmed}</div>
            <div className="text-sm text-blue-600">Confirmados</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="text-2xl font-bold text-indigo-700">{stats.preparing}</div>
            <div className="text-sm text-indigo-600">Preparando</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats.ready}</div>
            <div className="text-sm text-green-600">Listos</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats.delivered}</div>
            <div className="text-sm text-green-600">Entregados</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-700">{stats.cancelled}</div>
            <div className="text-sm text-red-600">Cancelados</div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-6 space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por cliente, número de pedido o restaurante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">
              {searchTerm ? 'No se encontraron pedidos que coincidan con tu búsqueda.' :
               selectedStatus === 'all' 
                ? 'No hay pedidos disponibles en este momento.'
                : `No hay pedidos con estado "${statusOptions.find(s => s.value === selectedStatus)?.label || selectedStatus}".`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
                isUpdating={updatingOrder === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;