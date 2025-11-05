import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.tsx'
import { CartProvider } from './contexts/CartContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Auth } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { Orders } from './pages/Orders'
import { MenuPage } from './pages/Menu'
import { Analytics } from './pages/Analytics'
import { Settings } from './pages/Settings'
import Tables from './pages/Tables'
import Restaurants from './pages/Restaurants'
import RestaurantMenu from './pages/RestaurantMenu'
import RestaurantSelection from './pages/RestaurantSelection'
import AddRestaurant from './pages/AddRestaurant'
import Cart from './pages/Cart'
import OrderManagement from './pages/OrderManagement'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/select-restaurant" replace />} />
                  <Route path="/select-restaurant" element={<RestaurantSelection />} />
                  <Route path="/restaurants" element={<Restaurants />} />
                  <Route path="/restaurants/add" element={<AddRestaurant />} />
                  <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
                  <Route path="/tables" element={<Tables />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/order-management" element={<OrderManagement />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App