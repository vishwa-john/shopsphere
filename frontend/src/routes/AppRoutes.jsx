import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Pages
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import WishlistPage from '../pages/WishlistPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';

// Admin
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public Layout Wrapper with standard container styling
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// 404 Not Found Page
const NotFound = () => {
  return (
    <div className="py-24 text-center space-y-4">
      <h1 className="text-6xl font-black text-indigo-600">404</h1>
      <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        The destination you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md"
      >
        Return to Home
      </Link>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Panel Layout */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
