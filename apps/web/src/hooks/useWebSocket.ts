import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_URL } from '@/config/api';

interface NotificationData {
  type: 'new_order' | 'order_status_update' | 'order_ready';
  data: any;
  timestamp: Date;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  notifications: NotificationData[];
  clearNotifications: () => void;
  joinRestaurantRoom: (restaurantId: string) => void;
  joinCustomerRoom: (customerId: string) => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Conectar al servidor WebSocket usando la configuración dinámica
    const baseUrl = WS_URL.replace('ws://', 'http://').replace('wss://', 'https://');
    const newSocket = io(baseUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Eventos de conexión
    newSocket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
      setIsConnected(false);
    });

    // Eventos de notificaciones
    newSocket.on('new_order', (data) => {
      console.log('Nuevo pedido recibido:', data);
      setNotifications(prev => [...prev, {
        type: 'new_order',
        data,
        timestamp: new Date()
      }]);
    });

    newSocket.on('order_status_update', (data) => {
      console.log('Actualización de estado de pedido:', data);
      setNotifications(prev => [...prev, {
        type: 'order_status_update',
        data,
        timestamp: new Date()
      }]);
    });

    newSocket.on('order_ready', (data) => {
      console.log('Pedido listo:', data);
      setNotifications(prev => [...prev, {
        type: 'order_ready',
        data,
        timestamp: new Date()
      }]);
    });

    // Cleanup al desmontar
    return () => {
      newSocket.close();
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const joinRestaurantRoom = (restaurantId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join_restaurant', restaurantId);
      console.log(`Unido a la sala del restaurante: ${restaurantId}`);
    }
  };

  const joinCustomerRoom = (customerId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join_customer', customerId);
      console.log(`Unido a la sala del cliente: ${customerId}`);
    }
  };

  return {
    socket,
    isConnected,
    notifications,
    clearNotifications,
    joinRestaurantRoom,
    joinCustomerRoom
  };
};