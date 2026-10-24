import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    // Fetch categories once
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'all') params.append('category', category);
        if (sort) params.append('sort', sort);
        if (page) params.append('page', page);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.total || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, sort, page, minPrice, maxPrice]);

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'all') {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shop Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {totalCount} curated items
            {search && ` for "${search}"`}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Sort by:
          </label>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Filters
              </h3>
              {(category !== 'all' || search || minPrice || maxPrice) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', 'all')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium transition-colors ${
                    category === 'all'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium transition-colors ${
                      category === cat.slug
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Price (₹)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                No matching products found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try loosening your filter criteria or searching for another keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => updateParam('page', page - 1)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-slate-600 font-semibold px-2">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => updateParam('page', page + 1)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
