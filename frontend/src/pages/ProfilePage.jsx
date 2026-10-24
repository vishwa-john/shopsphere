import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { setUser } from '../redux/slices/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // New Address State
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setProfileMsg('');
    try {
      const res = await api.put('/auth/profile', {
        name,
        ...(password && { password }),
      });
      dispatch(setUser(res.data.user));
      setProfileMsg('Account profile updated successfully.');
      setPassword('');
    } catch (err) {
      alert(err.message || 'Error updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/addresses', newAddr);
      dispatch(setUser({ ...user, addresses: res.data.addresses }));
      setShowAddAddr(false);
      setNewAddr({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false,
      });
    } catch (err) {
      alert(err.message || 'Error adding address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this saved address?')) return;
    try {
      const res = await api.delete(`/auth/addresses/${addressId}`);
      dispatch(setUser({ ...user, addresses: res.data.addresses }));
    } catch (err) {
      alert(err.message || 'Error removing address');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Profile & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your credentials, security preferences, and delivery destinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-200">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                {user?.role} Account
              </span>
            </div>
          </div>

          {profileMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-200">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm"
            >
              {isUpdating ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Saved Addresses Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" /> Saved Addresses
            </h2>
            <button
              onClick={() => setShowAddAddr(!showAddAddr)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add New
            </button>
          </div>

          {/* Add Address Form */}
          {showAddAddr && (
            <form
              onSubmit={handleAddAddress}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs"
            >
              <h4 className="font-bold text-slate-800">Add Delivery Destination</h4>
              <input
                type="text"
                required
                placeholder="Street address / apartment"
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Postal Code"
                value={newAddr.postalCode}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, postalCode: e.target.value })
                }
                className="w-full p-2 bg-white border border-slate-200 rounded-xl"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDef"
                  checked={newAddr.isDefault}
                  onChange={(e) =>
                    setNewAddr({ ...newAddr, isDefault: e.target.checked })
                  }
                />
                <label htmlFor="isDef" className="text-slate-600">
                  Set as default address
                </label>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAddr(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List of addresses */}
          <div className="space-y-3">
            {(!user?.addresses || user.addresses.length === 0) && (
              <p className="text-xs text-slate-400 italic">No saved addresses yet.</p>
            )}
            {user?.addresses?.map((addr) => (
              <div
                key={addr._id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between text-xs"
              >
                <div>
                  {addr.isDefault && (
                    <span className="inline-block px-2 py-0.5 mb-1 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Default Delivery
                    </span>
                  )}
                  <p className="font-bold text-slate-800">{addr.street}</p>
                  <p className="text-slate-500">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-slate-400 text-[11px]">{addr.country}</p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
