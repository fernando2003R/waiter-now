import React, { useState, useRef } from 'react';
import { X, Users, MapPin, Grid, Save } from 'lucide-react';

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tableData: TableFormData) => void;
  existingTables: Table[];
}

interface TableFormData {
  number: string;
  name?: string;
  capacity: number;
  section?: string;
  positionX: number;
  positionY: number;
  notes?: string;
}

interface Table {
  id: string;
  number: string;
  name?: string;
  capacity: number;
  section?: string;
  positionX: number;
  positionY: number;
  status: string;
}

const AddTableModal: React.FC<AddTableModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingTables
}) => {
  const [formData, setFormData] = useState<TableFormData>({
    number: '',
    name: '',
    capacity: 4,
    section: '',
    positionX: 100,
    positionY: 100,
    notes: ''
  });

  const [showGrid, setShowGrid] = useState(true);
  const floorPlanRef = useRef<HTMLDivElement>(null);

  const handleFloorPlanClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!floorPlanRef.current) return;
    
    const rect = floorPlanRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap to grid (20px grid)
    const gridSize = 20;
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    
    setFormData(prev => ({
      ...prev,
      positionX: Math.max(0, Math.min(snappedX, rect.width - 120)),
      positionY: Math.max(0, Math.min(snappedY, rect.height - 100))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.number.trim()) {
      alert('El número de mesa es requerido');
      return;
    }
    
    if (formData.capacity < 1 || formData.capacity > 20) {
      alert('La capacidad debe ser entre 1 y 20 personas');
      return;
    }
    
    // Verificar que no exista una mesa con el mismo número
    const existingTable = existingTables.find(table => table.number === formData.number);
    if (existingTable) {
      alert('Ya existe una mesa con ese número');
      return;
    }
    
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      number: '',
      name: '',
      capacity: 4,
      section: '',
      positionX: 100,
      positionY: 100,
      notes: ''
    });
    onClose();
  };

  const sections = [
    'Interior',
    'Terraza',
    'VIP',
    'Barra',
    'Privado',
    'Jardín'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Nueva Mesa</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulario */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de la Mesa
                </h3>

                {/* Número de Mesa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Mesa *
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: 1, A1, VIP-1"
                    required
                  />
                </div>

                {/* Nombre (Opcional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Mesa Terraza, Mesa VIP"
                  />
                </div>

                {/* Capacidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad *
                  </label>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <span className="text-sm text-gray-500">personas</span>
                  </div>
                </div>

                {/* Sección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sección
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar sección</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>

                {/* Coordenadas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posición X
                    </label>
                    <input
                      type="number"
                      value={formData.positionX}
                      onChange={(e) => setFormData(prev => ({ ...prev, positionX: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posición Y
                    </label>
                    <input
                      type="number"
                      value={formData.positionY}
                      onChange={(e) => setFormData(prev => ({ ...prev, positionY: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notas especiales sobre la mesa..."
                  />
                </div>
              </div>

              {/* Vista Previa del Plano */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Posición en el Plano
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowGrid(!showGrid)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                      showGrid 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span>Cuadrícula</span>
                  </button>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Haz clic en el plano para posicionar la mesa
                </div>

                {/* Plano Interactivo */}
                <div
                  ref={floorPlanRef}
                  className="relative w-full h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair overflow-hidden"
                  onClick={handleFloorPlanClick}
                  style={{
                    backgroundImage: showGrid 
                      ? 'radial-gradient(circle, #d1d5db 1px, transparent 1px)'
                      : 'none',
                    backgroundSize: showGrid ? '20px 20px' : 'auto'
                  }}
                >
                  <div className="absolute top-2 left-2 text-xs text-gray-500">
                    Plano del Restaurante
                  </div>

                  {/* Mesas Existentes */}
                  {existingTables.map(table => (
                    <div
                      key={table.id}
                      className="absolute w-24 h-20 bg-gray-200 border border-gray-400 rounded-lg flex items-center justify-center text-xs font-medium text-gray-700"
                      style={{
                        left: `${table.positionX}px`,
                        top: `${table.positionY}px`
                      }}
                    >
                      {table.number}
                    </div>
                  ))}

                  {/* Nueva Mesa (Preview) */}
                  <div
                    className="absolute w-24 h-20 bg-green-200 border-2 border-green-500 rounded-lg flex items-center justify-center text-xs font-bold text-green-800 shadow-lg"
                    style={{
                      left: `${formData.positionX}px`,
                      top: `${formData.positionY}px`
                    }}
                  >
                    {formData.number || 'Nueva'}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Posición actual: X: {formData.positionX}, Y: {formData.positionY}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Crear Mesa</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTableModal;