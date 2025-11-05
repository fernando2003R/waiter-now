import { useState, useEffect } from 'react'
import { API_URL, DEFAULT_HEADERS } from '@/config/api';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  cuisine: string;
  priceRange: 'BUDGET' | 'MID_RANGE' | 'FINE_DINING';
  rating: number;
  isActive: boolean;
  openingHours: any;
  deliveryRadius: number;
  deliveryFee: number;
  minimumOrder: number;
  estimatedDeliveryTime: number;
  imageUrl?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  reviewCount: number;
  orderCount: number;
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseRestaurantsParams {
  search?: string;
  cuisine?: string;
  priceRange?: string;
  page?: number;
  limit?: number;
}

export function useRestaurants(params: UseRestaurantsParams = {}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.cuisine) queryParams.append('cuisine', params.cuisine);
      if (params.priceRange) queryParams.append('priceRange', params.priceRange);
      queryParams.append('page', (params.page || 1).toString());
      queryParams.append('limit', (params.limit || 12).toString());

      const response = await fetch(`${API_URL}/restaurants?${queryParams}`, {
        headers: DEFAULT_HEADERS
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los restaurantes');
      }

      const apiResponse = await response.json();
      const data: RestaurantsResponse = apiResponse.data;
      setRestaurants(data.restaurants);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [params.search, params.cuisine, params.priceRange, params.page, params.limit]);

  return {
    restaurants,
    loading,
    error,
    pagination,
    refetch: fetchRestaurants,
  };
}