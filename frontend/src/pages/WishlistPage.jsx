import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleMoveToCart = async (productId) => {
    await dispatch(addToCart({ productId, qty: 1 }));
    await dispatch(removeFromWishlist(productId));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Saved Items</h2>
        <p className="text-xs text-slate-500">
          Sign in to access your personal wishlist across all your devices.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500">
          Save your favorite products to purchase later or monitor price drops.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Saved Wishlist ({items.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => {
          const effectivePrice =
            product.discount > 0
              ? Math.round(product.price * (1 - product.discount / 100))
              : product.price;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square relative bg-slate-100">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full shadow-sm transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-indigo-600">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-black text-slate-900 text-base">
                      ₹{effectivePrice.toLocaleString('en-IN')}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleMoveToCart(product._id)}
                  disabled={product.stock <= 0}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {product.stock <= 0 ? 'Out of Stock' : 'Move to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
