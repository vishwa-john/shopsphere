import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    category: '',
    stock: '',
    imageUrl: '',
    isFeatured: false,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products?limit=50'),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
      if (catRes.data.categories?.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: catRes.data.categories[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '0',
      category: categories[0]?._id || '',
      stock: '',
      imageUrl: '',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price,
      discount: p.discount || 0,
      category: p.category?._id || p.category,
      stock: p.stock,
      imageUrl: p.images?.[0] || '',
      isFeatured: p.isFeatured || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        discount: Number(formData.discount),
        category: formData.category,
        stock: Number(formData.stock),
        images: formData.imageUrl
          ? [formData.imageUrl]
          : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        isFeatured: formData.isFeatured,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Product Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update stock, and control merchandise pricing.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Filter products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-700/80">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price (₹)</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Loading inventory table...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{p.name}</p>
                          {p.isFeatured && (
                            <span className="text-[10px] text-amber-400 font-bold">
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {p.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white">
                      ₹{p.price.toLocaleString('en-IN')}
                      {p.discount > 0 && (
                        <span className="text-[10px] text-rose-400 ml-1.5 font-sans">
                          (-{p.discount}%)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.stock <= 0
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : p.stock <= 5
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {p.stock <= 0 ? 'Out of Stock' : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-amber-400 font-semibold">
                      ★ {p.ratingAvg || '4.8'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Stock *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Image URL (Unsplash or CDN)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                />
                <label htmlFor="feat" className="text-slate-300">
                  Feature this item on homepage
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/30"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
