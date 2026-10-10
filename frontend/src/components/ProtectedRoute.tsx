import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/signup" replace />
}

export function PublicOnlyRoute() {
  const { token } = useAuth()
  return token ? <Navigate to="/home" replace /> : <Outlet />
}