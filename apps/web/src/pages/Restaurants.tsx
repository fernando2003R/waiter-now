import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Clock, MapPin, Filter, Loader2, Plus } from 'lucide-react';
import { formatCOP } from '../utils/currency';
import { restaurantLogos } from '../components/logos';
import { WaiterNowLogo } from '../components/WaiterNowLogo';
import { useRestaurants } from '../hooks/useRestaurants';

// Mapeo de tipos de cocina para las categorías
const cuisineCategories = [
  'Todos',
  'Café',
  'Hamburguesas',
  'Pizza',
  'Comida Rápida',
  'Postres',
  'Italiana',
  'Mexicana',
  'Asiática',
  'Colombiana'
];

export default function Restaurants() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('rating');

  // Usar el hook para obtener datos de restaurantes
  const { restaurants, loading, error } = useRestaurants({
    search: searchTerm || undefined,
    cuisine: selectedCategory !== 'Todos' ? selectedCategory : undefined,
  });

  // Filtrar y ordenar restaurantes
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];
    return restaurants
      .filter(restaurant => restaurant.isActive)
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'deliveryTime') return a.estimatedDeliveryTime - b.estimatedDeliveryTime;
        if (sortBy === 'deliveryFee') return a.deliveryFee - b.deliveryFee;
        return 0;
      });
  }, [restaurants, sortBy]);

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <WaiterNowLogo width={80} height={80} />
            </div>
            <p className="text-lg text-gray-600">
              Pide de tus restaurantes favoritos y recibe en minutos
            </p>
          </div>

          {/* Add Restaurant Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate('/restaurants/add')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Restaurante
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Busca restaurantes, comida o categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {cuisineCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">Mejor calificados</option>
                <option value="deliveryTime">Más rápidos</option>
                <option value="deliveryFee">Menor costo de envío</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Cargando restaurantes...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Error al cargar restaurantes
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Restaurants Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant.id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                {/* Restaurant Image/Logo */}
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {(() => {
                    const LogoComponent = restaurantLogos[restaurant.name as keyof typeof restaurantLogos];
                    return LogoComponent ? (
                      <LogoComponent width={80} height={80} />
                    ) : (
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {restaurant.name.charAt(0)}
                      </div>
                    );
                  })()}
                </div>

                {/* Restaurant Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {restaurant.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.estimatedDeliveryTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{restaurant.deliveryRadius} km</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {restaurant.cuisine}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        Envío: {formatCOP(restaurant.deliveryFee)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Pedido mínimo: {formatCOP(restaurant.minimumOrder)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No encontramos restaurantes
            </h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o categorías
            </p>
          </div>
        )}
      </div>
    </div>
  );
}