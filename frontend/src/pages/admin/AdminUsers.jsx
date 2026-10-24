import React, { useEffect, useState } from 'react';
import { Shield, User, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Change this user's role to ${newRole.toUpperCase()}?`)) return;

    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message || 'Error updating user role');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          User Accounts & Permissions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor customer accounts and grant administrative roles.
        </p>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-700/80">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Registered Date</th>
                <th className="px-6 py-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    Loading user records...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {u.role === 'admin' ? (
                          <Shield className="w-3 h-3" />
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleRole(u._id, u.role)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] font-bold transition-colors inline-flex items-center gap-1.5 border border-slate-700"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Set as {u.role === 'admin' ? 'Customer' : 'Admin'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
