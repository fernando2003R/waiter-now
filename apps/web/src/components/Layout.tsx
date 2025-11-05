import { useState, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth.tsx'
import { WaiterNowLogoCompact, WaiterNowText } from './WaiterNowLogo'
import { NotificationCenter } from './NotificationCenter'
import {
  LayoutDashboard,
  ShoppingBag,
  Menu as MenuIcon,
  BarChart3,
  Settings,
  User,
  LogOut,
  X,
  Store,
  ShoppingCart,
  LayoutGrid,
  ClipboardList
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

interface NavigationItem {
  name: string
  href: string
  icon: any
  isPrimary?: boolean
}

const navigation: NavigationItem[] = [
  { name: 'Seleccionar Restaurante', href: '/select-restaurant', icon: Store, isPrimary: true },
  { name: 'Mesas', href: '/tables', icon: LayoutGrid },
  { name: 'Carrito', href: '/cart', icon: ShoppingCart },
  { name: 'Mis Pedidos', href: '/orders', icon: ShoppingBag },
  { name: 'Gestión de Pedidos', href: '/order-management', icon: ClipboardList },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Administrar Restaurantes', href: '/restaurants', icon: Settings },
  { name: 'Menú', href: '/menu', icon: MenuIcon },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <WaiterNowLogoCompact width={32} height={32} />
                <WaiterNowText size="sm" className="ml-2" />
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                const isPrimary = item.isPrimary
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors ${
                      isPrimary
                        ? isActive
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                        : isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      isPrimary 
                        ? 'text-white' 
                        : isActive 
                        ? 'text-primary-600' 
                        : 'text-gray-400'
                    }`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4">
            <WaiterNowLogoCompact width={32} height={32} />
            <WaiterNowText size="sm" className="ml-2" />
          </div>
          <nav className="flex-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const isPrimary = item.isPrimary
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors ${
                    isPrimary
                      ? isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                      : isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isPrimary 
                      ? 'text-white' 
                      : isActive 
                      ? 'text-primary-600' 
                      : 'text-gray-400'
                  }`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-600 lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <NotificationCenter />
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}