import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Otp from './pages/Otp'
import ProductDetail from './pages/ProductDetail'
import SignUp from './pages/Signup'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp" element={<Otp />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}