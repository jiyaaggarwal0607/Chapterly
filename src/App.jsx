import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderConfirmation from './pages/OrderConfirmation';
import Shop from './pages/Shop';

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/confirmation" element={<OrderConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
