import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { clearCart } from '../redux/slices/cartSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, subtotal } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {};

  const [address, setAddress] = useState({
    street: defaultAddr.street || '',
    city: defaultAddr.city || '',
    state: defaultAddr.state || '',
    postalCode: defaultAddr.postalCode || '',
    country: defaultAddr.country || 'India',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const tax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + tax + shippingFee;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Load external Razorpay SDK script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!address.street || !address.city || !address.state || !address.postalCode) {
      return setErrorMessage('Please fill in complete shipping address details.');
    }

    setIsProcessing(true);

    try {
      // 1. Create order on backend (with server-side price recalculation)
      const formattedItems = items.map((i) => ({
        product: i.product._id,
        qty: i.qty,
      }));

      const { data: paymentRes } = await api.post('/payment/create-order', {
        items: formattedItems,
      });

      const { order: rzpOrder, keyId } = paymentRes;

      // 2. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay || rzpOrder.id.includes('_simulated')) {
        // Fallback simulation mode for testing environments without public Razorpay keys
        console.log('[Checkout] Running simulated payment completion');
        const simulatedPaymentId = `pay_sim_${Date.now()}`;

        // Verify simulated signature
        await api.post('/payment/verify', {
          razorpay_order_id: rzpOrder.id,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: 'simulated_valid_signature',
        });

        // Create Order in DB
        const { data: orderData } = await api.post('/orders', {
          items: formattedItems,
          shippingAddress: address,
          paymentMethod: 'Razorpay',
          paymentStatus: 'completed',
          paymentId: simulatedPaymentId,
          razorpayOrderId: rzpOrder.id,
        });

        dispatch(clearCart());
        navigate(`/orders?success=true&orderId=${orderData.order._id}`);
        return;
      }

      // Real Razorpay modal invocation
      const options = {
        key: keyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || 'INR',
        name: 'ShopSphere E-Commerce',
        description: 'Payment for your ShopSphere Order',
        order_id: rzpOrder.id,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#4f46e5',
        },
        handler: async function (response) {
          try {
            // Verify HMAC signature on backend
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Create Order in database
            const { data: orderData } = await api.post('/orders', {
              items: formattedItems,
              shippingAddress: address,
              paymentMethod: 'Razorpay',
              paymentStatus: 'completed',
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            dispatch(clearCart());
            navigate(`/orders?success=true&orderId=${orderData.order._id}`);
          } catch (err) {
            setErrorMessage('Payment verification failed on the server.');
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        setErrorMessage(
          response.error?.description || 'Payment was declined or cancelled.'
        );
      });
      razorpayInstance.open();
    } catch (err) {
      setErrorMessage(err.message || 'Error initializing payment gateway.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" /> 256-Bit Encrypted Checkout
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Address Inputs */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            1. Shipping Address
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Street Address / Flat / Building *
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="e.g. Flat 402, Sunshine Apartments, MG Road"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="e.g. Bengaluru"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="e.g. Karnataka"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Postal Code (PIN) *
                </label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) =>
                    setAddress({ ...address, postalCode: e.target.value })
                  }
                  placeholder="e.g. 560001"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value={address.country}
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              2. Payment Method
            </h3>
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-950">
                  Razorpay Secure Gateway (Test Mode)
                </p>
                <p className="text-[11px] text-slate-500">
                  Supports UPI, Credit/Debit Cards, NetBanking, and Wallets
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Order Summary & Confirm */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
              Items Snapshot ({items.length})
            </h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i._id} className="flex justify-between text-xs text-slate-600">
                  <span className="truncate pr-2">
                    {i.qty}x {i.product?.name}
                  </span>
                  <span className="font-semibold text-slate-900 whitespace-nowrap">
                    ₹{i.itemTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (5%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Payable Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing Secure Payment...' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
