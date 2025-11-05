import { useState, useEffect } from 'react'
import { API_URL, DEFAULT_HEADERS } from '@/config/api';

export interface ItemVariant {
  id: string;
  name: string;
  description?: string;
  priceChange: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  calories?: number;
  ingredients?: string;
  allergens?: string;
  variants: ItemVariant[];
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  categories: MenuCategory[];
}

export interface RestaurantDetails {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  banner?: string;
  rating: number;
  totalReviews: number;
  deliveryTime: number;
  minimumOrder: number;
  acceptsOrders: boolean;
  workingHours?: any;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  orderCount: number;
  menus: Menu[];
}

export function useRestaurant(restaurantId: string | undefined) {
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurant = async () => {
    if (!restaurantId) {
      setError('ID de restaurante requerido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/restaurants/${restaurantId}`, {
        headers: DEFAULT_HEADERS
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Restaurante no encontrado');
        }
        throw new Error('Error al cargar el restaurante');
      }

      const result = await response.json();
      
      if (result.success) {
        setRestaurant(result.data);
      } else {
        throw new Error(result.message || 'Error al cargar el restaurante');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  return {
    restaurant,
    loading,
    error,
    refetch: fetchRestaurant,
  };
}