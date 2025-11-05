import { useState } from 'react'
import { 
  Save, 
  Upload, 
  Bell, 
  Shield, 
  CreditCard, 
  Users, 
  Store, 
  Globe,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Clock,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react'

interface SettingsTabProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

function SettingsTabs({ activeTab, setActiveTab }: SettingsTabProps) {
  const tabs = [
    { id: 'restaurant', label: 'Restaurante', icon: Store },
    { id: 'profile', label: 'Perfil', icon: Users },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'billing', label: 'Facturación', icon: CreditCard }
  ]

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function RestaurantSettings() {
  const [restaurantData, setRestaurantData] = useState({
    name: 'La Bella Italia',
    description: 'Auténtica cocina italiana en el corazón de la ciudad',
    address: 'Calle Mayor 123, 28001 Madrid',
    phone: '+34 91 123 45 67',
    email: 'info@labellaitallia.com',
    website: 'www.labellaitallia.com',
    cuisine: 'italiana',
    priceRange: 'medio',
    capacity: 80,
    openingHours: {
      monday: { open: '12:00', close: '23:00', closed: false },
      tuesday: { open: '12:00', close: '23:00', closed: false },
      wednesday: { open: '12:00', close: '23:00', closed: false },
      thursday: { open: '12:00', close: '23:00', closed: false },
      friday: { open: '12:00', close: '24:00', closed: false },
      saturday: { open: '12:00', close: '24:00', closed: false },
      sunday: { open: '12:00', close: '23:00', closed: false }
    }
  })

  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ]

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Información básica</h3>
        </div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del restaurante
              </label>
              <input
                type="text"
                value={restaurantData.name}
                onChange={(e) => setRestaurantData(prev => ({ ...prev, name: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de cocina
              </label>
              <select
                value={restaurantData.cuisine}
                onChange={(e) => setRestaurantData(prev => ({ ...prev, cuisine: e.target.value }))}
                className="input"
              >
                <option value="italiana">Italiana</option>
                <option value="española">Española</option>
                <option value="mexicana">Mexicana</option>
                <option value="asiática">Asiática</option>
                <option value="mediterránea">Mediterránea</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              rows={3}
              value={restaurantData.description}
              onChange={(e) => setRestaurantData(prev => ({ ...prev, description: e.target.value }))}
              className="input"
              placeholder="Describe tu restaurante..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de precios
              </label>
              <select
                value={restaurantData.priceRange}
                onChange={(e) => setRestaurantData(prev => ({ ...prev, priceRange: e.target.value }))}
                className="input"
              >
                <option value="económico">Económico ($)</option>
                <option value="medio">Medio ($$)</option>
                <option value="alto">Alto ($$$)</option>
                <option value="lujo">Lujo ($$$$)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad (personas)
              </label>
              <input
                type="number"
                value={restaurantData.capacity}
                onChange={(e) => setRestaurantData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                className="input"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Información de contacto</h3>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Dirección
            </label>
            <input
              type="text"
              value={restaurantData.address}
              onChange={(e) => setRestaurantData(prev => ({ ...prev, address: e.target.value }))}
              className="input"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Teléfono
              </label>
              <input
                type="tel"
                value={restaurantData.phone}
                onChange={(e) => setRestaurantData(prev => ({ ...prev, phone: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={restaurantData.email}
                onChange={(e) => setRestaurantData(prev => ({ ...prev, email: e.target.value }))}
                className="input"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="h-4 w-4 inline mr-1" />
              Sitio web
            </label>
            <input
              type="url"
              value={restaurantData.website}
              onChange={(e) => setRestaurantData(prev => ({ ...prev, website: e.target.value }))}
              className="input"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Clock className="h-5 w-5 inline mr-2" />
            Horarios de apertura
          </h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {days.map((day) => (
              <div key={day.key} className="flex items-center space-x-4">
                <div className="w-20">
                  <span className="text-sm font-medium text-gray-700">{day.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!restaurantData.openingHours[day.key as keyof typeof restaurantData.openingHours].closed}
                    onChange={(e) => {
                      setRestaurantData(prev => ({
                        ...prev,
                        openingHours: {
                          ...prev.openingHours,
                          [day.key]: {
                            ...prev.openingHours[day.key as keyof typeof prev.openingHours],
                            closed: !e.target.checked
                          }
                        }
                      }))
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">Abierto</span>
                </div>
                {!restaurantData.openingHours[day.key as keyof typeof restaurantData.openingHours].closed && (
                  <>
                    <input
                      type="time"
                      value={restaurantData.openingHours[day.key as keyof typeof restaurantData.openingHours].open}
                      onChange={(e) => {
                        setRestaurantData(prev => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [day.key]: {
                              ...prev.openingHours[day.key as keyof typeof prev.openingHours],
                              open: e.target.value
                            }
                          }
                        }))
                      }}
                      className="input input-sm"
                    />
                    <span className="text-gray-500">a</span>
                    <input
                      type="time"
                      value={restaurantData.openingHours[day.key as keyof typeof restaurantData.openingHours].close}
                      onChange={(e) => {
                        setRestaurantData(prev => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [day.key]: {
                              ...prev.openingHours[day.key as keyof typeof prev.openingHours],
                              close: e.target.value
                            }
                          }
                        }))
                      }}
                      className="input input-sm"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSettings() {
  const [profileData, setProfileData] = useState({
    name: 'Juan Pérez',
    email: 'juan@labellaitallia.com',
    phone: '+34 666 123 456',
    role: 'Propietario',
    avatar: null
  })

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Información personal</h3>
        </div>
        <div className="card-body space-y-4">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <button className="btn btn-outline btn-sm">
                <Upload className="h-4 w-4 mr-2" />
                Cambiar foto
              </button>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG hasta 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo
              </label>
              <input
                type="text"
                value={profileData.role}
                onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    customerReviews: true,
    lowStock: true,
    dailyReports: false,
    weeklyReports: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  })

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Notificaciones de pedidos</h3>
        </div>
        <div className="card-body space-y-4">
          {[
            { key: 'newOrders', label: 'Nuevos pedidos', description: 'Recibir notificación cuando llegue un nuevo pedido' },
            { key: 'orderUpdates', label: 'Actualizaciones de pedidos', description: 'Notificaciones sobre cambios en el estado de los pedidos' },
            { key: 'customerReviews', label: 'Reseñas de clientes', description: 'Cuando los clientes dejen nuevas reseñas' },
            { key: 'lowStock', label: 'Stock bajo', description: 'Alertas cuando los ingredientes estén por agotarse' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications] as boolean}
                onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Reportes</h3>
        </div>
        <div className="card-body space-y-4">
          {[
            { key: 'dailyReports', label: 'Reportes diarios', description: 'Resumen diario de ventas y actividad' },
            { key: 'weeklyReports', label: 'Reportes semanales', description: 'Análisis semanal de rendimiento' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key as keyof typeof notifications] as boolean}
                onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Canales de notificación</h3>
        </div>
        <div className="card-body space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email', description: 'Recibir notificaciones por correo electrónico', icon: Mail },
            { key: 'smsNotifications', label: 'SMS', description: 'Recibir notificaciones por mensaje de texto', icon: Smartphone },
            { key: 'pushNotifications', label: 'Push', description: 'Notificaciones push en el navegador', icon: Bell }
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications] as boolean}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Cambiar contraseña</h3>
        </div>
        <div className="card-body space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Confirma tu nueva contraseña"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button className="btn btn-primary">
            Actualizar contraseña
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Autenticación de dos factores</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Autenticación de dos factores</p>
              <p className="text-sm text-gray-500">Añade una capa extra de seguridad a tu cuenta</p>
            </div>
            <button className="btn btn-outline">
              Configurar
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Sesiones activas</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Navegador actual</p>
                <p className="text-sm text-gray-500">Chrome en Windows • Madrid, España</p>
                <p className="text-xs text-gray-400">Última actividad: Ahora</p>
              </div>
              <span className="badge badge-success">Actual</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">iPhone</p>
                <p className="text-sm text-gray-500">Safari en iOS • Madrid, España</p>
                <p className="text-xs text-gray-400">Última actividad: Hace 2 horas</p>
              </div>
              <button className="btn btn-outline btn-sm btn-error">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Plan actual</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Plan Profesional</h4>
              <p className="text-sm text-gray-500">$120,000/mes • Facturado mensualmente</p>
              <p className="text-xs text-gray-400">Próxima facturación: 15 de febrero, 2024</p>
            </div>
            <button className="btn btn-outline">
              Cambiar plan
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Método de pago</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expira 12/26</p>
              </div>
            </div>
            <button className="btn btn-outline btn-sm">
              Editar
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Historial de facturación</h3>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            {[
              { date: '15 Ene 2024', amount: '$120,000', status: 'Pagado', invoice: 'INV-001' },
              { date: '15 Dic 2023', amount: '$120,000', status: 'Pagado', invoice: 'INV-002' },
              { date: '15 Nov 2023', amount: '$120,000', status: 'Pagado', invoice: 'INV-003' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.invoice}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{item.amount}</p>
                  <span className="badge badge-success badge-sm">{item.status}</span>
                </div>
                <button className="btn btn-outline btn-sm">
                  Descargar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Settings() {
  const [activeTab, setActiveTab] = useState('restaurant')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'restaurant':
        return <RestaurantSettings />
      case 'profile':
        return <ProfileSettings />
      case 'notifications':
        return <NotificationSettings />
      case 'security':
        return <SecuritySettings />
      case 'billing':
        return <BillingSettings />
      default:
        return <RestaurantSettings />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Gestiona la configuración de tu restaurante y cuenta</p>
        </div>
        <button className="btn btn-primary mt-4 sm:mt-0">
          <Save className="h-4 w-4 mr-2" />
          Guardar cambios
        </button>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-body p-0">
          <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}