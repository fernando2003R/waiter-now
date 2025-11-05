import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  Clock, 
  MapPin, 
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
  Eye,
  Search, 
  Edit,
  X
} from 'lucide-react';
import { tablesAPI, Table } from '@/lib/api';
import AddTableModal from '../components/AddTableModal';

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tables and reservations
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const tablesData = await tablesAPI.getTables();
        setTables(tablesData);
      } catch (err) {
        console.error('Error loading tables data:', err);
        setError('Error al cargar los datos de las mesas');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle table creation
  const handleCreateTable = async (tableData: any) => {
    try {
      const newTable = await tablesAPI.createTable(tableData);
      setTables(prev => [...prev, newTable]);
      setShowAddTableModal(false);
    } catch (err) {
      console.error('Error creating table:', err);
      alert('Error al crear la mesa. Por favor, inténtalo de nuevo.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'maintenance':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'occupied':
        return <Users className="w-4 h-4" />;
      case 'reserved':
        return <Calendar className="w-4 h-4" />;
      case 'maintenance':
        return <Settings className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  const filteredTables = tables.filter(table => {
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    const matchesSearch = table.number.toString().toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const TableCard: React.FC<{ table: Table; onClick: () => void }> = ({ table, onClick }) => (
    <div
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${getStatusColor(table.status)}`}
      onClick={onClick}
      style={{
        position: viewMode === 'map' ? 'absolute' : 'relative',
        left: viewMode === 'map' ? `${table.positionX}px` : 'auto',
        top: viewMode === 'map' ? `${table.positionY}px` : 'auto',
        width: viewMode === 'map' ? '120px' : 'auto',
        height: viewMode === 'map' ? '100px' : 'auto'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon(table.status)}
          <span className="font-semibold">Mesa {table.number}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-sm">
        <Users className="w-3 h-3" />
        <span>{table.capacity} personas</span>
      </div>
      
      <div className="text-xs text-gray-600 mt-1">
        {getStatusText(table.status)}
      </div>
      
      {table.currentOrderId && (
        <div className="mt-2 text-xs">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Pedido activo</span>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando mesas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mesas</h1>
          <p className="text-gray-600 mt-1">Administra las mesas y reservas de tu restaurante</p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowReservationModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>
          
          <button
            onClick={() => setShowAddTableModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Mesa</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-1" />
              Mapa
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Lista
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar mesa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponible</option>
            <option value="occupied">Ocupada</option>
            <option value="reserved">Reservada</option>
            <option value="maintenance">Mantenimiento</option>
          </select>
        </div>
      </div>

      {/* Tables Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'map' ? (
          <div className="relative p-8 min-h-[600px] bg-gray-50">
            <div className="absolute inset-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="absolute top-4 left-4 text-sm text-gray-500">
                Plano del Restaurante
              </div>
              {filteredTables.map(table => (
                <TableCard
                  key={table.id}
                  table={table}
                  onClick={() => setSelectedTable(table)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTables.map(table => (
                <TableCard
                  key={table.id}
                  table={table}
                  onClick={() => setSelectedTable(table)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {tables.filter(t => t.status === 'available').length}
          </div>
          <div className="text-sm text-gray-600">Disponibles</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {tables.filter(t => t.status === 'occupied').length}
          </div>
          <div className="text-sm text-gray-600">Ocupadas</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {tables.filter(t => t.status === 'reserved').length}
          </div>
          <div className="text-sm text-gray-600">Reservadas</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {tables.filter(t => t.status === 'maintenance').length}
          </div>
          <div className="text-sm text-gray-600">Mantenimiento</div>
        </div>
      </div>

      {/* Table Details Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Mesa {selectedTable.number}
                  </h2>
                  <p className="text-gray-600">ID: {selectedTable.id}</p>
                </div>
                <button
                  onClick={() => setSelectedTable(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Capacidad</div>
                  <div className="text-lg font-semibold">{selectedTable.capacity} personas</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Estado</div>
                  <div className={`text-lg font-semibold`}>
                    {getStatusText(selectedTable.status)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Posición X</div>
                  <div className="text-lg font-semibold">{selectedTable.positionX}px</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Posición Y</div>
                  <div className="text-lg font-semibold">{selectedTable.positionY}px</div>
                </div>
              </div>

              {selectedTable.currentOrderId && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Pedido Activo</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">ID del Pedido</div>
                    <div className="font-medium">{selectedTable.currentOrderId}</div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowTableModal(true)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Editar Mesa
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Cambiar Estado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTable ? 'Editar Mesa' : 'Nueva Mesa'}
                </h2>
                <button
                  onClick={() => {
                    setShowTableModal(false);
                    setSelectedTable(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Mesa
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posición X
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posición Y
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="available">Disponible</option>
                    <option value="occupied">Ocupada</option>
                    <option value="reserved">Reservada</option>
                    <option value="maintenance">Mantenimiento</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTableModal(false);
                      setSelectedTable(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {selectedTable ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Nueva Reserva</h2>
                <button
                  onClick={() => setShowReservationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesa
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Seleccionar mesa</option>
                    {tables
                      .filter(table => table.status === 'available')
                      .map(table => (
                        <option key={table.id} value={table.id}>
                          Mesa {table.number} (Capacidad: {table.capacity})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Personas
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    min="30"
                    step="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="90"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReservationModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Crear Reserva
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      <AddTableModal
        isOpen={showAddTableModal}
        onClose={() => setShowAddTableModal(false)}
        onSave={handleCreateTable}
        existingTables={tables}
      />
    </div>
  );
};

export default Tables;