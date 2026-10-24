import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-20 text-center text-slate-400 font-semibold animate-pulse">
        Loading analytics engine...
      </div>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    totalUsers,
    lowStockCount,
    salesChartData,
    topProducts,
  } = stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Executive Overview
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics, transaction trends, and inventory warnings.
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> Verified Razorpay Settlements
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalOrders}</div>
          <p className="text-[11px] text-slate-400">Processed across all statuses</p>
        </div>

        {/* Registered Users */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customers
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{totalUsers}</div>
          <p className="text-[11px] text-slate-400">Active customer profiles</p>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Low Stock Items
            </span>
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{lowStockCount}</div>
          <p className="text-[11px] text-amber-400 font-semibold">
            ≤ 5 units remaining in catalog
          </p>
        </div>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Revenue Trajectory (₹)
            </h3>
            <span className="text-[11px] text-indigo-400 font-mono">Monthly Run-rate</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume Chart */}
        <div className="lg:col-span-1 bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Order Volume
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono">Count</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Products */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Top Performing Catalog Items
        </h3>

        {topProducts?.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No products sold yet.</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-slate-400 text-[11px]">
                      {p.totalUnitsSold} units sold
                    </p>
                  </div>
                </div>
                <div className="font-black text-indigo-400 text-sm">
                  ₹{p.totalRevenue?.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
