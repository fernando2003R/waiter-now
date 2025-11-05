import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Download,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  Star,
  Target
} from 'lucide-react'
import { formatCOP } from '../utils/currency'
import { 
  Line, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts'

// Datos de ejemplo
const salesTrendData = [
  { date: '2024-01-01', ventas: 2400, pedidos: 45, clientes: 38 },
  { date: '2024-01-02', ventas: 1398, pedidos: 28, clientes: 25 },
  { date: '2024-01-03', ventas: 9800, pedidos: 89, clientes: 76 },
  { date: '2024-01-04', ventas: 3908, pedidos: 52, clientes: 44 },
  { date: '2024-01-05', ventas: 4800, pedidos: 67, clientes: 58 },
  { date: '2024-01-06', ventas: 3800, pedidos: 48, clientes: 41 },
  { date: '2024-01-07', ventas: 4300, pedidos: 59, clientes: 52 }
]

const hourlyData = [
  { hora: '08:00', pedidos: 5, ventas: 120 },
  { hora: '09:00', pedidos: 8, ventas: 200 },
  { hora: '10:00', pedidos: 12, ventas: 350 },
  { hora: '11:00', pedidos: 15, ventas: 420 },
  { hora: '12:00', pedidos: 25, ventas: 680 },
  { hora: '13:00', pedidos: 35, ventas: 950 },
  { hora: '14:00', pedidos: 42, ventas: 1200 },
  { hora: '15:00', pedidos: 28, ventas: 780 },
  { hora: '16:00', pedidos: 18, ventas: 450 },
  { hora: '17:00', pedidos: 22, ventas: 580 },
  { hora: '18:00', pedidos: 30, ventas: 820 },
  { hora: '19:00', pedidos: 38, ventas: 1050 },
  { hora: '20:00', pedidos: 45, ventas: 1300 },
  { hora: '21:00', pedidos: 52, ventas: 1480 },
  { hora: '22:00', pedidos: 35, ventas: 980 },
  { hora: '23:00', pedidos: 15, ventas: 380 }
]

const topDishesData = [
  { name: 'Pizza Margherita', pedidos: 156, ingresos: 1950, color: '#f59e0b' },
  { name: 'Hamburguesa BBQ', pedidos: 134, ingresos: 1876, color: '#3b82f6' },
  { name: 'Ensalada César', pedidos: 98, ingresos: 931, color: '#10b981' },
  { name: 'Pasta Carbonara', pedidos: 87, ingresos: 1044, color: '#ef4444' },
  { name: 'Salmón a la plancha', pedidos: 76, ingresos: 1520, color: '#8b5cf6' }
]

const customerSegmentData = [
  { name: 'Nuevos clientes', value: 35, color: '#3b82f6' },
  { name: 'Clientes recurrentes', value: 45, color: '#10b981' },
  { name: 'Clientes VIP', value: 20, color: '#f59e0b' }
]

const paymentMethodData = [
  { name: 'Tarjeta', value: 65, color: '#3b82f6' },
  { name: 'Efectivo', value: 25, color: '#10b981' },
  { name: 'Transferencia', value: 10, color: '#f59e0b' }
]

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: 'primary' | 'success' | 'warning' | 'error'
  subtitle?: string
}

function MetricCard({ title, value, change, icon, color, subtitle }: MetricCardProps) {
  const isPositive = change >= 0
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
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
              <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
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

export function Analytics() {
  const [dateRange, setDateRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('ventas')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analíticas</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento de tu restaurante</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input"
          >
            <option value="1d">Hoy</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 3 meses</option>
            <option value="1y">Último año</option>
          </select>
          <button className="btn btn-outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ingresos totales"
          value={formatCOP(12847000)}
          change={15.3}
          icon={<DollarSign className="h-6 w-6" />}
          color="primary"
          subtitle={`${formatCOP(1835000)} promedio diario`}
        />
        <MetricCard
          title="Pedidos totales"
          value="456"
          change={8.7}
          icon={<ShoppingBag className="h-6 w-6" />}
          color="success"
          subtitle="65 promedio diario"
        />
        <MetricCard
          title="Clientes únicos"
          value="289"
          change={-2.1}
          icon={<Users className="h-6 w-6" />}
          color="warning"
          subtitle="41 promedio diario"
        />
        <MetricCard
          title="Ticket promedio"
          value={formatCOP(28170)}
          change={6.2}
          icon={<Target className="h-6 w-6" />}
          color="error"
          subtitle={`+${formatCOP(1650)} vs anterior`}
        />
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de ventas */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="card-title">Tendencia de ventas</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="input input-sm"
              >
                <option value="ventas">Ventas</option>
                <option value="pedidos">Pedidos</option>
                <option value="clientes">Clientes</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                  formatter={(value, name) => [
                    name === 'ventas' ? formatCOP(value as number) : value,
                    name === 'ventas' ? 'Ventas' : name === 'pedidos' ? 'Pedidos' : 'Clientes'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric}
                  stroke="#f59e0b" 
                  fill="#fef3c7" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric}
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Análisis por horas */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Actividad por horas</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'ventas' ? formatCOP(value as number) : value,
                    name === 'ventas' ? 'Ventas' : 'Pedidos'
                  ]}
                />
                <Bar dataKey="pedidos" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Análisis detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top platos */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Platos más populares</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {topDishesData.map((dish, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dish.color }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dish.name}</p>
                      <p className="text-xs text-gray-500">{dish.pedidos} pedidos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCOP(dish.ingresos * 1000)}</p>
                    <p className="text-xs text-gray-500">ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Segmentación de clientes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Segmentación de clientes</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={customerSegmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {customerSegmentData.map((item, index) => (
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

        {/* Métodos de pago */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Métodos de pago</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethodData.map((item, index) => (
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

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <Clock className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">18 min</div>
            <div className="text-sm text-gray-600">Tiempo promedio de preparación</div>
            <div className="text-xs text-success-600 mt-1">-2 min vs anterior</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Rating promedio</div>
            <div className="text-xs text-success-600 mt-1">+0.2 vs anterior</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <Target className="h-8 w-8 text-success-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">94%</div>
            <div className="text-sm text-gray-600">Tasa de satisfacción</div>
            <div className="text-xs text-success-600 mt-1">+3% vs anterior</div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <Users className="h-8 w-8 text-warning-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">67%</div>
            <div className="text-sm text-gray-600">Clientes recurrentes</div>
            <div className="text-xs text-success-600 mt-1">+5% vs anterior</div>
          </div>
        </div>
      </div>
    </div>
  )
}