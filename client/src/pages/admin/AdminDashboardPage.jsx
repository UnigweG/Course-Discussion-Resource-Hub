import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function AdminDashboardPage() {
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState(null);

  // Users tab state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Discussions tab state
  const [discussions, setDiscussions] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);

  // Load stats on mount
  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {});
  }, []);

  // Load users when on users tab
  useEffect(() => {
    if (tab !== 'users') return;
    setLoadingUsers(true);
    fetch(`/api/admin/users?q=${encodeURIComponent(userSearch)}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setUsers(d.data); })
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [tab, userSearch]);

  // Load discussions when on discussions tab
  useEffect(() => {
    if (tab !== 'discussions') return;
    setLoadingDiscussions(true);
    fetch('/api/admin/discussions', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setDiscussions(d.data); })
      .catch(() => {})
      .finally(() => setLoadingDiscussions(false));
  }, [tab]);

  async function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, status: newStatus } : u));
      }
    } catch {}
  }

  async function deleteDiscussion(id) {
    if (!window.confirm('Delete this discussion and all its comments?')) return;
    try {
      const res = await fetch(`/api/admin/discussions/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) setDiscussions((prev) => prev.filter((d) => d._id !== id));
    } catch {}
  }

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Manage users and moderate content." />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Total Users" value={stats?.totalUsers ?? '…'} icon="👥" />
        <StatCard label="Discussions" value={stats?.totalDiscussions ?? '…'} icon="💬" />
        <StatCard label="Comments" value={stats?.totalComments ?? '…'} icon="✏️" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['users', 'discussions'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-4 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {tab === 'users' && (
        <div>
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search by username or email…"
            className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loadingUsers ? (
            <p className="text-sm text-gray-500">Loading users…</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Username</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.username}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleUserStatus(u._id, u.status)}
                          className={`text-xs px-3 py-1 rounded-md font-medium ${u.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        >
                          {u.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Discussions tab */}
      {tab === 'discussions' && (
        <div>
          {loadingDiscussions ? (
            <p className="text-sm text-gray-500">Loading discussions…</p>
          ) : (
            <div className="space-y-3">
              {discussions.map((d) => (
                <div key={d._id} className="flex items-start justify-between gap-4 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{d.title}</p>
                    <p className="text-xs text-blue-600 mt-0.5">{d.course} · by {d.authorUsername}</p>
                  </div>
                  <button
                    onClick={() => deleteDiscussion(d._id)}
                    className="text-xs px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 font-medium shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {discussions.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No discussions found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
