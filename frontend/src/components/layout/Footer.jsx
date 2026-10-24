import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-slate-800 rounded-full text-indigo-400 mb-2">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
            <p className="text-xs text-slate-400">On all prepaid orders over ₹999</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-slate-800 rounded-full text-indigo-400 mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Razorpay Secure Checkout</h4>
            <p className="text-xs text-slate-400">256-bit encrypted transactions</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-slate-800 rounded-full text-indigo-400 mb-2">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">7-Day Easy Returns</h4>
            <p className="text-xs text-slate-400">No questions asked policy</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-slate-800 rounded-full text-indigo-400 mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">24/7 Dedicated Support</h4>
            <p className="text-xs text-slate-400">Priority customer assistance</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white">ShopSphere</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            A production-ready full-stack MERN e-commerce architecture built with Express,
            MongoDB, Redux Toolkit, Tailwind CSS, and Razorpay.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 tracking-wider uppercase">
            Shop Catalog
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link to="/shop?category=electronics" className="hover:text-white transition-colors">
                Electronics & Audio
              </Link>
            </li>
            <li>
              <Link to="/shop?category=watches" className="hover:text-white transition-colors">
                Timepieces & Watches
              </Link>
            </li>
            <li>
              <Link to="/shop?category=footwear" className="hover:text-white transition-colors">
                Footwear & Runners
              </Link>
            </li>
            <li>
              <Link to="/shop?category=fashion" className="hover:text-white transition-colors">
                Apparel & Jackets
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Account */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 tracking-wider uppercase">
            Account
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link to="/orders" className="hover:text-white transition-colors">
                My Orders & Tracking
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-white transition-colors">
                Saved Wishlist
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition-colors">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-white transition-colors">
                Shipping Addresses
              </Link>
            </li>
          </ul>
        </div>

        {/* Portfolio & Architecture Notice */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3 tracking-wider uppercase">
            Architecture Stack
          </h4>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
            <span className="bg-slate-800 px-2 py-1 rounded">React + Vite</span>
            <span className="bg-slate-800 px-2 py-1 rounded">Redux Toolkit</span>
            <span className="bg-slate-800 px-2 py-1 rounded">Node.js + Express</span>
            <span className="bg-slate-800 px-2 py-1 rounded">MongoDB Mongoose</span>
            <span className="bg-slate-800 px-2 py-1 rounded">Razorpay API</span>
            <span className="bg-slate-800 px-2 py-1 rounded">JWT httpOnly</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ShopSphere Inc. Built for Engineering Portfolio.
      </div>
    </footer>
  );
};

export default Footer;
