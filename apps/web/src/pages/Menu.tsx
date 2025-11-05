import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Image,
  Clock,
  Star,
  MoreVertical
} from 'lucide-react'
import { Menu } from '@headlessui/react'
import { formatCOP } from '../utils/currency'

// Datos de ejemplo
const categories = [
  { id: '1', name: 'Entrantes', itemCount: 8, isActive: true },
  { id: '2', name: 'Platos principales', itemCount: 12, isActive: true },
  { id: '3', name: 'Postres', itemCount: 6, isActive: true },
  { id: '4', name: 'Bebidas', itemCount: 15, isActive: true },
  { id: '5', name: 'Vinos', itemCount: 10, isActive: false }
]

const menuItems = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Pizza clásica con tomate, mozzarella fresca y albahaca',
    price: 12.50,
    category: 'Platos principales',
    categoryId: '2',
    image: null,
    isActive: true,
    preparationTime: 15,
    allergens: ['gluten', 'lactosa'],
    rating: 4.8,
    orders: 156,
    variants: [
      { name: 'Pequeña', price: 10.50 },
      { name: 'Mediana', price: 12.50 },
      { name: 'Grande', price: 15.50 }
    ]
  },
  {
    id: '2',
    name: 'Ensalada César',
    description: 'Lechuga romana, pollo a la parrilla, parmesano y salsa césar',
    price: 9.50,
    category: 'Entrantes',
    categoryId: '1',
    image: null,
    isActive: true,
    preparationTime: 10,
    allergens: ['huevos', 'lactosa'],
    rating: 4.5,
    orders: 89,
    variants: []
  },
  {
    id: '3',
    name: 'Hamburguesa BBQ',
    description: 'Carne de ternera, queso cheddar, bacon, cebolla caramelizada y salsa BBQ',
    price: 14.00,
    category: 'Platos principales',
    categoryId: '2',
    image: null,
    isActive: true,
    preparationTime: 20,
    allergens: ['gluten', 'lactosa'],
    rating: 4.7,
    orders: 203,
    variants: [
      { name: 'Simple', price: 12.00 },
      { name: 'Doble carne', price: 16.00 }
    ]
  },
  {
    id: '4',
    name: 'Tiramisú',
    description: 'Postre italiano con café, mascarpone y cacao',
    price: 6.50,
    category: 'Postres',
    categoryId: '3',
    image: null,
    isActive: false,
    preparationTime: 5,
    allergens: ['huevos', 'lactosa', 'gluten'],
    rating: 4.9,
    orders: 67,
    variants: []
  }
]

interface MenuItemCardProps {
  item: typeof menuItems[0]
  onEdit: (item: typeof menuItems[0]) => void
  onToggleStatus: (itemId: string) => void
  onDelete: (itemId: string) => void
}

function MenuItemCard({ item, onEdit, onToggleStatus, onDelete }: MenuItemCardProps) {
  return (
    <div className={`card ${!item.isActive ? 'opacity-60' : ''}`}>
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              {!item.isActive && (
                <span className="badge badge-error badge-sm">Inactivo</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {item.preparationTime} min
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                {item.rating}
              </div>
              <div className="text-gray-400">
                {item.orders} pedidos
              </div>
            </div>
          </div>
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 rounded-lg hover:bg-gray-100">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onEdit(item)}
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onToggleStatus(item.id)}
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    {item.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Activar
                      </>
                    )}
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onDelete(item.id)}
                    className={`${
                      active ? 'bg-gray-50' : ''
                    } flex items-center w-full px-4 py-2 text-sm text-error-600`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>

        {/* Imagen placeholder */}
        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
          <Image className="h-8 w-8 text-gray-400" />
        </div>

        {/* Precio y variantes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {formatCOP(item.price)}
            </span>
            <span className="badge badge-primary badge-sm">
              {item.category}
            </span>
          </div>
          
          {item.variants.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Variantes:</p>
              <div className="space-y-1">
                {item.variants.map((variant, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{variant.name}</span>
                    <span className="font-medium">{formatCOP(variant.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Alérgenos */}
        {item.allergens.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Alérgenos:</p>
            <div className="flex flex-wrap gap-1">
              {item.allergens.map((allergen, index) => (
                <span key={index} className="badge badge-warning badge-xs">
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showInactive, setShowInactive] = useState(false)
  const [menuData, setMenuData] = useState(menuItems)

  const handleEdit = (item: typeof menuItems[0]) => {
    // TODO: Abrir modal de edición
    console.log('Editar item:', item)
  }

  const handleToggleStatus = (itemId: string) => {
    setMenuData(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isActive: !item.isActive }
          : item
      )
    )
  }

  const handleDelete = (itemId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      setMenuData(prev => prev.filter(item => item.id !== itemId))
    }
  }

  const filteredItems = menuData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory
    const matchesStatus = showInactive || item.isActive
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menú</h1>
          <p className="text-gray-600">Gestiona los platos y categorías de tu restaurante</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn btn-outline">
            <Plus className="h-4 w-4 mr-2" />
            Nueva categoría
          </button>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo plato
          </button>
        </div>
      </div>

      {/* Estadísticas de categorías */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="card">
            <div className="card-body text-center">
              <div className="text-lg font-bold text-gray-900">{category.itemCount}</div>
              <div className="text-sm text-gray-600">{category.name}</div>
              <div className={`text-xs mt-1 ${
                category.isActive ? 'text-success-600' : 'text-error-600'
              }`}>
                {category.isActive ? 'Activa' : 'Inactiva'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar platos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mostrar inactivos */}
            <div className="flex items-center">
              <input
                id="show-inactive"
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="show-inactive" className="ml-2 text-sm text-gray-700">
                Mostrar inactivos
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de platos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Estado vacío */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron platos
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' || !showInactive
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Aún no hay platos en el menú'
            }
          </p>
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Agregar primer plato
          </button>
        </div>
      )}
    </div>
  )
}