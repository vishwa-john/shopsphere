import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../redux/slices/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, subtotal, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ itemId, qty: newQty }));
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  // Business calculations matching backend recalculateOrderTotals
  const tax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + tax + shippingFee;

  const hasOutOfStockItem = items.some((item) => item.isOutOfStock);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart Awaits</h2>
        <p className="text-xs text-slate-500">
          Sign in to view items saved in your bag or sync across your devices.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md"
        >
          Sign In to ShopSphere
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Shopping Cart ({items.length})
        </h1>
        <button
          onClick={handleClear}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {hasOutOfStockItem && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          One or more items in your cart exceed currently available inventory. Please adjust
          quantities to proceed.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex gap-4 items-center transition-all ${
                item.isOutOfStock ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80 shadow-sm'
              }`}
            >
              <img
                src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                alt={item.product?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-slate-100 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product?._id}`}
                  className="font-bold text-slate-900 text-sm hover:text-indigo-600 line-clamp-1"
                >
                  {item.product?.name}
                </Link>

                <div className="text-xs text-slate-500 mt-1">
                  ₹{Math.round(item.itemTotal / item.qty).toLocaleString('en-IN')} each
                </div>

                {item.isOutOfStock && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">
                    Only {item.availableStock} in stock! Please reduce quantity.
                  </p>
                )}

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => handleUpdateQty(item._id, item.qty - 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-800">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item._id, item.qty + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-slate-900">
                  ₹{item.itemTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 sticky top-24">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated GST Tax (5%)</span>
                <span className="font-semibold text-slate-900">
                  ₹{tax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-[10px] text-indigo-600 italic">
                  Add ₹{(999 - subtotal).toLocaleString('en-IN')} more to unlock FREE Delivery!
                </p>
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-slate-900 text-sm">Total</span>
              <span className="font-black text-2xl text-slate-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={hasOutOfStockItem}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
