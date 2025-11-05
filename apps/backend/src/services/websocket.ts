import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export interface NotificationData {
  type: 'new_order' | 'order_status_update' | 'order_ready';
  orderId: string;
  restaurantId: string;
  message: string;
  data?: any;
}

class WebSocketService {
  private io: SocketIOServer | null = null;
  private connectedRestaurants: Map<string, Set<string>> = new Map(); // restaurantId -> Set of socketIds
  private connectedCustomers: Map<string, string> = new Map(); // customerId -> socketId

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          process.env['FRONTEND_URL'] || "http://localhost:5173",
          "http://localhost:3000"
        ],
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Cliente conectado:', socket.id);

      // Manejar conexión de restaurante
      socket.on('join_restaurant', (restaurantId: string) => {
        console.log(`Restaurante ${restaurantId} conectado con socket ${socket.id}`);
        
        if (!this.connectedRestaurants.has(restaurantId)) {
          this.connectedRestaurants.set(restaurantId, new Set());
        }
        this.connectedRestaurants.get(restaurantId)!.add(socket.id);
        
        socket.join(`restaurant_${restaurantId}`);
        socket.emit('connected', { type: 'restaurant', restaurantId });
      });

      // Manejar conexión de cliente
      socket.on('join_customer', (customerId: string) => {
        console.log(`Cliente ${customerId} conectado con socket ${socket.id}`);
        
        this.connectedCustomers.set(customerId, socket.id);
        socket.join(`customer_${customerId}`);
        socket.emit('connected', { type: 'customer', customerId });
      });

      // Manejar desconexión
      socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        
        // Remover de restaurantes conectados
        for (const [restaurantId, socketIds] of this.connectedRestaurants.entries()) {
          if (socketIds.has(socket.id)) {
            socketIds.delete(socket.id);
            if (socketIds.size === 0) {
              this.connectedRestaurants.delete(restaurantId);
            }
            break;
          }
        }

        // Remover de clientes conectados
        for (const [customerId, socketId] of this.connectedCustomers.entries()) {
          if (socketId === socket.id) {
            this.connectedCustomers.delete(customerId);
            break;
          }
        }
      });

      // Manejar ping para mantener conexión activa
      socket.on('ping', () => {
        socket.emit('pong');
      });
    });

    console.log('WebSocket server inicializado');
  }

  // Notificar nuevo pedido a restaurante
  notifyNewOrder(restaurantId: string, orderData: any) {
    if (!this.io) return;

    const notification: NotificationData = {
      type: 'new_order',
      orderId: orderData.id,
      restaurantId,
      message: `Nuevo pedido #${orderData.orderNumber} de ${orderData.customerName}`,
      data: orderData
    };

    console.log(`Enviando notificación de nuevo pedido a restaurante ${restaurantId}`);
    this.io.to(`restaurant_${restaurantId}`).emit('new_order', notification);
  }

  // Notificar cambio de estado de pedido
  notifyOrderStatusUpdate(restaurantId: string, customerId: string | null, orderData: any) {
    if (!this.io) return;

    // Notificar al restaurante
    const restaurantNotification: NotificationData = {
      type: 'order_status_update',
      orderId: orderData.id,
      restaurantId,
      message: `Pedido #${orderData.orderNumber} actualizado a ${orderData.status}`,
      data: orderData
    };

    this.io.to(`restaurant_${restaurantId}`).emit('order_status_update', restaurantNotification);

    // Notificar al cliente si está disponible
    if (customerId) {
      const customerNotification: NotificationData = {
        type: 'order_status_update',
        orderId: orderData.id,
        restaurantId,
        message: this.getCustomerStatusMessage(orderData.status, orderData.orderNumber),
        data: orderData
      };

      this.io.to(`customer_${customerId}`).emit('order_status_update', customerNotification);
    }
  }

  // Notificar que el pedido está listo
  notifyOrderReady(restaurantId: string, customerId: string | null, orderData: any) {
    if (!this.io) return;

    if (customerId) {
      const notification: NotificationData = {
        type: 'order_ready',
        orderId: orderData.id,
        restaurantId,
        message: `¡Tu pedido #${orderData.orderNumber} está listo para recoger!`,
        data: orderData
      };

      console.log(`Enviando notificación de pedido listo a cliente ${customerId}`);
      this.io.to(`customer_${customerId}`).emit('order_ready', notification);
    }
  }

  // Obtener estadísticas de conexiones
  getConnectionStats() {
    return {
      connectedRestaurants: Array.from(this.connectedRestaurants.keys()),
      connectedCustomers: Array.from(this.connectedCustomers.keys()),
      totalConnections: this.io?.engine.clientsCount || 0
    };
  }

  private getCustomerStatusMessage(status: string, orderNumber: string): string {
    switch (status) {
      case 'CONFIRMED':
        return `Tu pedido #${orderNumber} ha sido confirmado y está siendo preparado`;
      case 'PREPARING':
        return `Tu pedido #${orderNumber} está siendo preparado`;
      case 'READY':
        return `¡Tu pedido #${orderNumber} está listo para recoger!`;
      case 'DELIVERED':
        return `Tu pedido #${orderNumber} ha sido entregado. ¡Gracias por tu compra!`;
      case 'CANCELLED':
        return `Tu pedido #${orderNumber} ha sido cancelado`;
      default:
        return `Tu pedido #${orderNumber} ha sido actualizado`;
    }
  }
}

export const webSocketService = new WebSocketService();
export default webSocketService;