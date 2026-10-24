import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/categories'),
        ]);
        setFeaturedProducts(prodRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 md:p-16 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Curated Next-Gen E-Commerce Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Elevate Your Everyday <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
              Lifestyle & Tech
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover precision-engineered electronics, timeless horology, and minimalist
            streetwear. Backed by end-to-end Razorpay payments and real-time inventory tracking.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/shop"
              className="px-6 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 group"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop?category=electronics"
              className="px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors"
            >
              Browse Audio & Gadgets
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Featured Categories
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select a collection to filter your shopping experience
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200/80 hover:shadow-xl transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-base leading-tight">
                  {cat.name}
                </h3>
                <p className="text-slate-300 text-[11px] mt-0.5 line-clamp-1 opacity-90">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" /> Top Trending Picks
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Featured Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Browse Full Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
