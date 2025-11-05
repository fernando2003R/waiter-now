import React, { useState } from 'react';
import { Bell, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

interface NotificationCenterProps {
  restaurantId?: string;
  customerId?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  restaurantId,
  customerId
}) => {
  const { notifications, clearNotifications, isConnected, joinRestaurantRoom, joinCustomerRoom } = useWebSocket();
  const [isOpen, setIsOpen] = useState(false);

  // Unirse a las salas correspondientes cuando se proporcionen los IDs
  React.useEffect(() => {
    if (restaurantId) {
      joinRestaurantRoom(restaurantId);
    }
    if (customerId) {
      joinCustomerRoom(customerId);
    }
  }, [restaurantId, customerId, joinRestaurantRoom, joinCustomerRoom]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'order_status_update':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'order_ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'new_order':
        return 'Nuevo Pedido';
      case 'order_status_update':
        return 'Estado Actualizado';
      case 'order_ready':
        return 'Pedido Listo';
      default:
        return 'Notificación';
    }
  };

  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'new_order':
        return `Pedido #${notification.data.orderNumber} de ${notification.data.customerName}`;
      case 'order_status_update':
        return `Pedido #${notification.data.orderNumber} ahora está ${notification.data.status}`;
      case 'order_ready':
        return `Pedido #${notification.data.orderNumber} está listo para entregar`;
      default:
        return 'Nueva notificación';
    }
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {/* Indicador de conexión */}
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {getNotificationTitle(notification.type)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {getNotificationMessage(notification)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={clearNotifications}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Limpiar todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};