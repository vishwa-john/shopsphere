import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, CheckCircle2, Clock, Truck, Check, AlertCircle } from 'lucide-react';
import api from '../services/api';

const statusSteps = ['placed', 'packed', 'shipped', 'delivered'];

const OrdersPage = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSuccessRedirect = searchParams.get('success') === 'true';
  const newOrderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/my');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'packed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Checkout Success Banner */}
      {isSuccessRedirect && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-emerald-900">
              Payment Confirmed & Order Placed!
            </h3>
            <p className="text-xs text-emerald-700">
              Thank you for shopping with ShopSphere. Your order has been placed into our
              fulfillment queue.
              {newOrderId && (
                <span className="font-mono block mt-1 font-bold">
                  Order Reference ID: {newOrderId}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Orders & Tracking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your purchase history and track live shipment statuses.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-semibold animate-pulse">
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500">
            When you complete checkout, your active deliveries and invoice details will appear here.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = statusSteps.indexOf(order.orderStatus);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-mono font-bold text-slate-800">
                      ID: {order._id}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="font-black text-slate-900 text-base">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                {order.orderStatus !== 'cancelled' ? (
                  <div className="px-6 py-6 border-b border-slate-100">
                    <div className="relative flex items-center justify-between max-w-lg mx-auto">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0"></div>
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-500"
                        style={{
                          width: `${(Math.max(0, currentStepIdx) / (statusSteps.length - 1)) * 100}%`,
                        }}
                      ></div>

                      {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div
                            key={step}
                            className="relative z-10 flex flex-col items-center"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              }`}
                            >
                              {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider mt-1.5 ${
                                isCurrent
                                  ? 'text-indigo-600'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-4 bg-rose-50/50 border-b border-rose-100 flex items-center gap-2 text-rose-700 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4" /> This order has been cancelled.
                    Inventory and payments have been reconciled.
                  </div>
                )}

                {/* Items in this Order */}
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-slate-400 text-[11px]">
                              Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900">
                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address Snapshot */}
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Delivery Address: </span>
                    {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
