import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
} from 'lucide-react';
import { logoutUser } from '../../redux/slices/authSlice';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-700 bg-clip-text text-transparent">
              ShopSphere
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative flex-1 max-w-md mx-8"
          >
            <input
              type="text"
              placeholder="Search premium headphones, watches, apparel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-indigo-600 transition-colors">
              Shop Catalog
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems && wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Dropdown / Sign in */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 pr-3 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[90px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 text-sm z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-indigo-50 text-indigo-600">
                        {user?.role}
                      </span>
                    </div>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-indigo-600 hover:bg-indigo-50 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4" />
                      Account Settings
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-3 animate-in fade-in">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>
            <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Shop Catalog
              </Link>
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Order History & Tracking
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
