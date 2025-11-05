import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth.tsx'
import { formatCOP } from '../utils/currency'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Clock,
  Star,
  Eye
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Datos de ejemplo
const salesData = [
  { name: 'Lun', ventas: 4000, pedidos: 24 },
  { name: 'Mar', ventas: 3000, pedidos: 18 },
  { name: 'Mié', ventas: 5000, pedidos: 32 },
  { name: 'Jue', ventas: 4500, pedidos: 28 },
  { name: 'Vie', ventas: 6000, pedidos: 38 },
  { name: 'Sáb', ventas: 8000, pedidos: 52 },
  { name: 'Dom', ventas: 7000, pedidos: 45 }
]

const categoryData = [
  { name: 'Platos principales', value: 45, color: '#f59e0b' },
  { name: 'Bebidas', value: 25, color: '#3b82f6' },
  { name: 'Postres', value: 20, color: '#10b981' },
  { name: 'Entradas', value: 10, color: '#ef4444' }
]

const recentOrders = [
  { id: '#001', customer: 'Juan Pérez', items: 3, total: 45.50, status: 'completed', time: '10:30' },
  { id: '#002', customer: 'María García', items: 2, total: 32.00, status: 'preparing', time: '10:25' },
  { id: '#003', customer: 'Carlos López', items: 5, total: 78.25, status: 'pending', time: '10:20' },
  { id: '#004', customer: 'Ana Martín', items: 1, total: 15.00, status: 'completed', time: '10:15' }
]

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: 'primary' | 'success' | 'warning' | 'error'
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const isPositive = change >= 0
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-error-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-success-600' : 'text-error-600'
              }`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs ayer</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-${color}-100`}>
            <div className={`text-${color}-600`}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [timeRange, setTimeRange] = useState('7d')
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-gray-600">Gestiona tu restaurante de manera inteligente</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
          >
            <option value="1d">Hoy</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 3 meses</option>
          </select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas totales"
          value={formatCOP(2847000)}
          change={12.5}
          icon={<DollarSign className="h-6 w-6" />}
          color="primary"
        />
        <MetricCard
          title="Pedidos"
          value="156"
          change={8.2}
          icon={<ShoppingBag className="h-6 w-6" />}
          color="success"
        />
        <MetricCard
          title="Clientes"
          value="89"
          change={-2.1}
          icon={<Users className="h-6 w-6" />}
          color="warning"
        />
        <MetricCard
          title="Tiempo promedio"
          value="18 min"
          change={-5.3}
          icon={<Clock className="h-6 w-6" />}
          color="error"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Ventas de la semana</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'ventas' ? formatCOP(value as number) : value,
                    name === 'ventas' ? 'Ventas' : 'Pedidos'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#f59e0b" 
                  fill="#fef3c7" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de categorías */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Ventas por categoría</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos recientes y estadísticas adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pedidos recientes */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h3 className="card-title">Pedidos recientes</h3>
            <button className="btn btn-sm btn-outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver todos
            </button>
          </div>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCOP(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          order.status === 'completed' ? 'badge-success' :
                          order.status === 'preparing' ? 'badge-warning' :
                          'badge-error'
                        }`}>
                          {order.status === 'completed' ? 'Completado' :
                           order.status === 'preparing' ? 'Preparando' :
                           'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="space-y-6">
          {/* Rating promedio */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating promedio</p>
                  <div className="flex items-center mt-1">
                    <span className="text-2xl font-bold text-gray-900">4.8</span>
                    <div className="flex ml-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${
                            star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Basado en 127 reseñas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plato más popular */}
          <div className="card">
            <div className="card-body">
              <h4 className="font-medium text-gray-900 mb-3">Plato más popular</h4>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-orange-600 font-bold">🍕</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pizza Margherita</p>
                  <p className="text-sm text-gray-500">34 pedidos hoy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Horario pico */}
          <div className="card">
            <div className="card-body">
              <h4 className="font-medium text-gray-900 mb-3">Horario pico</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Almuerzo</span>
                  <span className="text-sm font-medium">13:00 - 15:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cena</span>
                  <span className="text-sm font-medium">20:00 - 22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}