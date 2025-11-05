import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, ChefHat, Utensils } from 'lucide-react';
import { WaiterNowLogo } from '../components/WaiterNowLogo';
import { BurgerKingLogo } from '../components/logos/BurgerKingLogo';
import { DominosLogo } from '../components/logos/DominosLogo';
import { JuanValdezLogo } from '../components/logos/JuanValdezLogo';
import { KFCLogo } from '../components/logos/KFCLogo';
import { McDonaldsLogo } from '../components/logos/McDonaldsLogo';
import { PizzaHutLogo } from '../components/logos/PizzaHutLogo';
import { SubwayLogo } from '../components/logos/SubwayLogo';
import { StarbucksLogo } from '../components/logos/StarbucksLogo';
import { API_URL, DEFAULT_HEADERS } from '../config/api';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  address: string;
  phone: string;
  rating: number;
  deliveryTime: number;
  minimumOrder: number;
  workingHours: string;
}

const RestaurantSelection: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Función para obtener el logo SVG basado en el nombre del restaurante
  const getRestaurantLogo = (restaurantName: string) => {
    const name = restaurantName.toLowerCase();
    
    if (name.includes('burger king')) {
      return <BurgerKingLogo width={64} height={64} />;
    } else if (name.includes('domino')) {
      return <DominosLogo width={64} height={64} />;
    } else if (name.includes('juan valdez')) {
      return <JuanValdezLogo width={64} height={64} />;
    } else if (name.includes('kfc')) {
      return <KFCLogo width={64} height={64} />;
    } else if (name.includes('mcdonald')) {
      return <McDonaldsLogo width={64} height={64} />;
    } else if (name.includes('pizza hut')) {
      return <PizzaHutLogo width={64} height={64} />;
    } else if (name.includes('subway')) {
      return <SubwayLogo width={64} height={64} />;
    } else if (name.includes('starbucks')) {
      return <StarbucksLogo width={64} height={64} />;
    }
    
    return null;
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/menus/restaurants`, {
        headers: DEFAULT_HEADERS
      });
      const data = await response.json();
      
      if (data.success) {
        setRestaurants(data.data);
      } else {
        setError(data.message || 'Error al cargar restaurantes');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSelect = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRestaurants}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <WaiterNowLogo width={80} height={80} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ¡Bienvenido a Waiter Now!
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              Elige tu restaurante favorito y disfruta de una experiencia gastronómica única
            </p>
            <div className="flex justify-center items-center space-x-8 text-blue-100">
              <div className="flex items-center">
                <ChefHat className="h-6 w-6 mr-2" />
                <span>Comida de calidad</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                <span>Entrega rápida</span>
              </div>
              <div className="flex items-center">
                <Utensils className="h-6 w-6 mr-2" />
                <span>Variedad de opciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Restaurantes Disponibles</h2>
          <p className="text-gray-600">Selecciona un restaurante para ver su menú y hacer tu pedido</p>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay restaurantes disponibles</h3>
            <p className="text-gray-600">Por favor, vuelve más tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleRestaurantSelect(restaurant.id)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100"
              >
                {/* Restaurant Banner */}
                <div className="h-48 bg-gray-200 relative">
                  {restaurant.banner ? (
                    <img
                      src={restaurant.banner}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-white text-4xl font-bold">
                        {restaurant.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Logo overlay */}
                  <div className="absolute bottom-4 left-4">
                    {getRestaurantLogo(restaurant.name) ? (
                      <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden">
                        {getRestaurantLogo(restaurant.name)}
                      </div>
                    ) : restaurant.logo ? (
                      <img
                        src={restaurant.logo}
                        alt={`${restaurant.name} logo`}
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {restaurant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                  
                  {restaurant.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                  )}

                  {/* Rating and Delivery Time */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">
                        {restaurant.rating.toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{restaurant.deliveryTime} min</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start mb-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600 line-clamp-2">{restaurant.address}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center mb-4">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{restaurant.phone}</span>
                  </div>

                  {/* Minimum Order */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pedido mínimo:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCOP(restaurant.minimumOrder)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Ver Menú y Ordenar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantSelection;