import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlistItems.some(
    (item) => (item._id || item) === product._id
  );

  const effectivePrice =
    product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return navigate('/login');
    }
    if (product.stock <= 0) return;

    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product._id, qty: 1 })).unwrap();
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return navigate('/login');
    }
    await dispatch(toggleWishlist(product._id));
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>

          {/* Discount Badge */}
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
              -{product.discount}%
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500'
                : 'bg-white/90 text-slate-400 hover:text-rose-500'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`}
            />
          </button>

          {/* Out of Stock Overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-rose-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider shadow">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{product.category?.name || 'General'}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.ratingAvg || '4.8'}</span>
              <span className="text-slate-400">({product.ratingCount || 0})</span>
            </div>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="p-4 pt-0">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-extrabold text-slate-900">
            ₹{effectivePrice.toLocaleString('en-IN')}
          </span>
          {product.discount > 0 && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isAdding}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            product.stock <= 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : addedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow'
          }`}
        >
          {addedSuccess ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart
            </>
          ) : product.stock <= 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
