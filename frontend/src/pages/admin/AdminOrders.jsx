import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      alert(err.message || 'Error updating order status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Customer Orders Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review invoices, manage tracking checkpoints, and process fulfillment.
        </p>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-700/80">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total (₹)</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold text-white">
                        #{order._id.substring(order._id.length - 8)}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{order.user?.name || 'Customer'}</p>
                      <p className="text-[10px] text-slate-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-200">
                        {order.items?.length} items
                      </span>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">
                        {order.items?.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-white text-sm">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.paymentStatus === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none border ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : 'bg-slate-900 text-indigo-300 border-indigo-700/50'
                        }`}
                      >
                        <option value="placed">Placed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
