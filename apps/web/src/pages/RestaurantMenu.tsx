import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import { formatCOP } from '../utils/currency';
import { restaurantLogos } from '../components/logos';
import { useCart } from '../contexts/CartContext';
import { useRestaurant, MenuItem } from '../hooks/useRestaurant';

export default function RestaurantMenu() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Usar el hook para obtener datos del restaurante
  const { restaurant, loading, error } = useRestaurant(restaurantId);
  
  // Usar el contexto del carrito
  const { 
    addToCart, 
    removeFromCart, 
    getItemQuantity, 
    getTotalPrice, 
    getTotalItems 
  } = useCart();

  useEffect(() => {
    if (!loading && !restaurant && !error) {
      navigate('/restaurants');
    }
  }, [restaurant, loading, error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-gray-600">Cargando restaurante...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Error al cargar el restaurante
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver a restaurantes
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Restaurante no encontrado
          </h3>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Volver a restaurantes
          </button>
        </div>
      </div>
    );
  }

  // Obtener todas las categorías del menú
  const allCategories = restaurant.menus.flatMap(menu => menu.categories);
  const categories = ['Todos', ...Array.from(new Set(allCategories.map(cat => cat.name)))];
  
  // Filtrar items por categoría
  const filteredCategories = selectedCategory === 'Todos' 
    ? allCategories 
    : allCategories.filter(category => category.name === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      restaurantName: restaurant.name,
      restaurantId: restaurant.id
    });
  };

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

          {/* Restaurant Info */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              {(() => {
                const LogoComponent = restaurantLogos[restaurant.name as keyof typeof restaurantLogos];
                return LogoComponent ? (
                  <LogoComponent width={60} height={60} />
                ) : (
                  <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    {restaurant.name.charAt(0)}
                  </div>
                );
              })()}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 mb-2">{restaurant.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{restaurant.rating.toFixed(1)} ({restaurant.totalReviews} reseñas)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.address}</span>
                </div>
              </div>
              
              <div className="mt-2 text-sm">
                <span className="text-green-600 font-medium">
                  Pedido mínimo: {formatCOP(restaurant.minimumOrder)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-gray-600 mb-4">{category.description}</p>
            )}
            
            <div className="space-y-4">
              {category.items.map((item) => {
                const quantity = getItemQuantity(item.id);
                
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {item.calories && (
                            <span>{item.calories} cal</span>
                          )}
                          {item.ingredients && (
                            <span>Ingredientes: {item.ingredients}</span>
                          )}
                        </div>
                        
                        {item.allergens && (
                          <p className="text-xs text-orange-600 mt-1">
                            Alérgenos: {item.allergens}
                          </p>
                        )}
                        
                        <div className="mt-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatCOP(item.price)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {item.image && (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                            <span className="text-2xl">{item.image}</span>
                          </div>
                        )}
                        
                        {quantity === 0 ? (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Agregar
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Item Variants */}
                    {item.variants && item.variants.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Opciones disponibles:
                        </h4>
                        <div className="space-y-1">
                          {item.variants.map((variant) => (
                            <div key={variant.id} className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {variant.name}
                                {variant.description && ` - ${variant.description}`}
                              </span>
                              <span className="text-gray-900">
                                {variant.priceChange > 0 ? '+' : ''}
                                {formatCOP(variant.priceChange)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No hay items en esta categoría
            </h3>
            <p className="text-gray-600">
              Selecciona otra categoría para ver más opciones
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => navigate('/cart')}
            className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="font-medium">
              {getTotalItems()} items - {formatCOP(getTotalPrice())}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}