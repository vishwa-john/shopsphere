import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { loginUser, clearError } from '../redux/slices/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin');
      else navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(loginUser({ email: demoEmail, password: demoPassword }));
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-0">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-200">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to ShopSphere
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your cart, orders, and wishlist
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Profiles for Interviewers/Reviewers */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick 1-Click Portfolio Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                handleQuickLogin('customer@shopsphere.com', 'Customer@123')
              }
              className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Customer
              </div>
              <p className="text-[10px] text-slate-400 truncate">customer@shopsphere.com</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@shopsphere.com', 'Admin@123')}
              className="p-2.5 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 rounded-xl text-left transition-colors"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Shield className="w-3.5 h-3.5 text-purple-600" /> Admin
              </div>
              <p className="text-[10px] text-slate-400 truncate">admin@shopsphere.com</p>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
