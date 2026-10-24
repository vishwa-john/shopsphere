import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import ReviewList from '../components/product/ReviewList';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const isWishlisted = wishlistItems.some(
    (item) => (item._id || item) === product?._id
  );

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
        setReviews(res.data.reviews || []);
        if (res.data.product.images?.length > 0) {
          setActiveImage(res.data.product.images[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 font-semibold animate-pulse">
        Loading product information...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <Link to="/shop" className="text-indigo-600 font-bold mt-2 inline-block">
          Return to Shop Catalog
        </Link>
      </div>
    );
  }

  const effectivePrice =
    product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (product.stock <= 0) return;

    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: product._id, qty })).unwrap();
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (err) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-slate-600">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-slate-600">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                SAVE {product.discount}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Action Panel */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              {product.category?.name || 'Exclusive'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm text-slate-800">
                  {product.ratingAvg || '4.8'}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                • {reviews.length} verified customer reviews
              </span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{effectivePrice.toLocaleString('en-IN')}
              </span>
              {product.discount > 0 && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-600 font-semibold">
              Inclusive of all taxes & free shipping included
            </p>
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs">
            {product.stock <= 0 ? (
              <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Only {product.stock} left in stock - order soon!
              </span>
            ) : (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                In Stock ({product.stock} units available)
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-600">Quantity:</label>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-slate-800">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAdding}
                className={`flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  product.stock <= 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : product.stock <= 0 ? (
                  'Currently Unavailable'
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => dispatch(toggleWishlist(product._id))}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500'
                }`}
                title="Save to Wishlist"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Product Overview
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-slate-500 font-medium">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
              Express Delivery
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
              Razorpay Secured
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <RotateCcw className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
              7-Day Returns
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Tab/Section */}
      <div className="pt-12 border-t border-slate-200">
        <ReviewList
          productId={product._id}
          reviews={reviews}
          onReviewAdded={handleReviewAdded}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
