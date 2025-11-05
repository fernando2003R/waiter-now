import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, MapPin, Clock, CreditCard, Users } from 'lucide-react';
import { useCart } from "../contexts/CartContext";
import { formatCurrency } from '../lib/utils';
import { API_URL, DEFAULT_HEADERS } from '../config/api';

interface Table {
  id: string;
  number: string;
  name?: string;
  capacity: number;
  section?: string;
  status: string;
}

export default function Cart() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalPrice, 
    getTotalItems,
    getCurrentRestaurant 
  } = useCart();
  
  // Estados existentes
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Nuevos estados para mesas
  const [orderType, setOrderType] = useState<'delivery' | 'dine_in'>('dine_in');
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [loadingTables, setLoadingTables] = useState(false);

  // Cargar mesas disponibles
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoadingTables(true);
        const response = await fetch(`${API_URL}/tables`, {
          headers: DEFAULT_HEADERS
        });
        const data = await response.json();
        
        if (data.success) {
          // Filtrar solo mesas disponibles
          const availableTables = data.data.filter((table: Table) => table.status === 'AVAILABLE');
          setTables(availableTables);
        }
      } catch (error) {
        console.error('Error loading tables:', error);
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, []);
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const getDeliveryFee = () => {
    return orderType === 'delivery' ? 3500 : 0; // Solo cobrar envío si es delivery
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleCheckout = async () => {
    // Validaciones según el tipo de pedido
    if (orderType === 'delivery') {
      if (!deliveryAddress.trim()) {
        alert('Por favor ingresa tu dirección de entrega');
        return;
      }
    } else {
      if (!selectedTableId) {
        alert('Por favor selecciona una mesa');
        return;
      }
    }

    if (!customerName.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const currentRestaurant = getCurrentRestaurant();
      if (!currentRestaurant) {
        alert('Error: No se pudo identificar el restaurante');
        setIsCheckingOut(false);
        return;
      }

      const orderData = {
        restaurantId: currentRestaurant,
        tableId: orderType === 'dine_in' ? selectedTableId : null,
        items: cartItems.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          price: item.price,
          notes: ''
        })),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || null,
        notes: orderType === 'delivery' 
          ? `Dirección de entrega: ${deliveryAddress.trim()}` 
          : `Mesa: ${tables.find(t => t.id === selectedTableId)?.number}`,
        paymentMethod,
        total: getTotal()
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`¡Pedido realizado exitosamente! 
Número de orden: ${result.data.orderNumber}
Tiempo estimado de entrega: ${new Date(result.data.estimatedDeliveryTime).toLocaleTimeString()}
Te contactaremos pronto.`);
        clearCart();
        navigate('/');
      } else {
        alert(`Error al crear el pedido: ${result.message}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">Agrega algunos productos deliciosos para comenzar</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Explorar restaurantes
          </button>
        </div>
      </div>
    );
  }

  const currentRestaurant = getCurrentRestaurant();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a restaurantes</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tu pedido</h1>
              {currentRestaurant && (
                <p className="text-gray-600">Productos de {currentRestaurant}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}
              </div>
              <div className="font-bold text-lg text-gray-900">
                {formatCurrency(getTotal())}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
              </div>
              
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{item.image}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="text-xs text-blue-600 mt-1">{item.restaurantName}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="font-bold text-lg text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Type Selection */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Tipo de pedido</h3>
              
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="orderType"
                    value="dine_in"
                    checked={orderType === 'dine_in'}
                    onChange={(e) => setOrderType(e.target.value as 'delivery' | 'dine_in')}
                    className="text-blue-500"
                  />
                  <Users className="h-5 w-5 text-gray-600" />
                  <div>
                    <span className="text-sm font-medium">Comer en el restaurante</span>
                    <p className="text-xs text-gray-500">Selecciona una mesa disponible</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="orderType"
                    value="delivery"
                    checked={orderType === 'delivery'}
                    onChange={(e) => setOrderType(e.target.value as 'delivery' | 'dine_in')}
                    className="text-blue-500"
                  />
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <div>
                    <span className="text-sm font-medium">Entrega a domicilio</span>
                    <p className="text-xs text-gray-500">Envío a tu dirección</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Información del cliente
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Tu número de teléfono"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Table Selection or Delivery Address */}
            {orderType === 'dine_in' ? (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Seleccionar mesa
                </h3>
                
                {loadingTables ? (
                  <div className="text-center py-4">
                    <div className="text-gray-500">Cargando mesas disponibles...</div>
                  </div>
                ) : tables.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-gray-500">No hay mesas disponibles en este momento</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {tables.map((table) => (
                      <label
                        key={table.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          selectedTableId === table.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="table"
                          value={table.id}
                          checked={selectedTableId === table.id}
                          onChange={(e) => setSelectedTableId(e.target.value)}
                          className="sr-only"
                        />
                        <div>
                          <div className="font-medium text-sm">Mesa {table.number}</div>
                          {table.name && (
                            <div className="text-xs text-gray-500">{table.name}</div>
                          )}
                          <div className="text-xs text-gray-500">
                            {table.capacity} personas • {table.section || 'General'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Información de entrega
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de entrega *
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Ingresa tu dirección completa"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Tiempo estimado: 25-35 min</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Método de pago
              </h3>
              
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-500"
                  />
                  <span className="text-sm">Tarjeta de crédito/débito</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-500"
                  />
                  <span className="text-sm">Efectivo</span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen del pedido</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(getSubtotal())}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo de envío</span>
                    <span className="font-medium">{formatCurrency(getDeliveryFee())}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">{formatCurrency(getTotal())}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={
                  isCheckingOut || 
                  !customerName.trim() ||
                  (orderType === 'delivery' && !deliveryAddress.trim()) ||
                  (orderType === 'dine_in' && !selectedTableId)
                }
                className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Procesando...' : 
                 orderType === 'delivery' ? 'Realizar pedido para entrega' : 'Realizar pedido para mesa'}
              </button>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Al realizar el pedido aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}