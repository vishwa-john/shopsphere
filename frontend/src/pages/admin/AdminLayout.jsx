import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  ShieldAlert,
} from 'lucide-react';

const AdminLayout = () => {
  const navItems = [
    { name: 'Analytics Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Orders Management', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Registered Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row -mx-4 sm:-mx-6 lg:-mx-8 -my-8 sm:-my-12">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/30">
              A
            </div>
            <div>
              <span className="font-extrabold text-base text-white">Admin Hub</span>
              <span className="block text-[10px] text-indigo-400 font-mono">ShopSphere v1.0</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Store className="w-4 h-4 text-indigo-400" />
            Back to Public Store
          </Link>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
