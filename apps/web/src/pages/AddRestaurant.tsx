import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AddRestaurantForm from '../components/AddRestaurantForm';

export default function AddRestaurant() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/restaurants');
  };

  const handleCancel = () => {
    navigate('/restaurants');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/restaurants')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Restaurantes
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Agregar Nuevo Restaurante</h1>
            <p className="mt-2 text-gray-600">
              Completa la información para registrar tu restaurante en la plataforma
            </p>
          </div>
        </div>

        {/* Form */}
        <AddRestaurantForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}