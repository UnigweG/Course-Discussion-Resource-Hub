import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { useToast } from '../../contexts/ToastContext';

/**
 * AdminDashboardPage — available only to users with role === 'admin'.
 * Two management tabs:
 *   Users       — search, role/status badges, enable/disable accounts
 *   Discussions — list all posts with a delete button
 */
function AdminDashboardPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState(null);

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [discussions, setDiscussions] = useState([]);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);

  // Fetch platform-wide stats for the three stat cards
  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {});
  }, []);

  // Re-fetch users whenever the active tab is "users" or the search term changes
  useEffect(() => {
    if (tab !== 'users') return;
    setLoadingUsers(true);
    fetch(`/api/admin/users?q=${encodeURIComponent(userSearch)}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setUsers(d.data); })
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [tab, userSearch]);

  // Fetch discussions when the discussions tab becomes active
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
        toast(`User ${newStatus}.`, 'success');
      }
    } catch {}
  }

  async function deleteDiscussion(id) {
    if (!window.confirm('Delete this discussion and all its comments?')) return;
    try {
      const res = await fetch(`/api/admin/discussions/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setDiscussions((prev) => prev.filter((d) => d._id !== id));
        toast('Discussion deleted.', 'success');
      }
    } catch {}
  }

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Manage users and moderate content." />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatCard label="Total Users"  value={stats?.totalUsers       ?? '…'} icon="👥" />
        <StatCard label="Discussions"  value={stats?.totalDiscussions ?? '…'} icon="💬" />
        <StatCard label="Comments"     value={stats?.totalComments    ?? '…'} icon="✏️" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {['users', 'discussions'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-4 text-sm font-medium capitalize border-b-2 transition-colors ${
              tab === t
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
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
            className="input max-w-sm mb-4"
          />
          {loadingUsers ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading users…</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 text-left">
                  <tr>
                    {['Username', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{u.username}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>{u.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleUserStatus(u._id, u.status)}
                          className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
                            u.status === 'active'
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100'
                              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100'
                          }`}
                        >
                          {u.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-600 dark:text-gray-400">
                        No users found.
                      </td>
                    </tr>
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
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading discussions…</p>
          ) : (
            <div className="space-y-3">
              {discussions.map((d) => (
                <div key={d._id} className="card rounded-lg px-4 py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{d.title}</p>
                    <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">
                      {d.course} · by {d.authorUsername}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteDiscussion(d._id)}
                    className="text-xs px-3 py-1 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 font-medium shrink-0 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {discussions.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-6">No discussions found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
