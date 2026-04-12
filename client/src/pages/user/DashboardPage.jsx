import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../contexts/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/activity', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setActivity(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.username || 'User'}`}
        description="Your activity overview and quick links."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard label="My Threads" value={loading ? '…' : activity?.counts.discussions ?? 0} icon="💬" />
        <StatCard label="Comments" value={loading ? '…' : activity?.counts.comments ?? 0} icon="✏️" />
        <StatCard label="Resources Shared" value={loading ? '…' : activity?.counts.resources ?? 0} icon="📎" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Discussions</h2>
        <Link to="/submit" className="text-sm text-blue-600 hover:underline">+ New Thread</Link>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : activity?.recent.discussions.length === 0 ? (
        <p className="text-sm text-gray-400">No discussions yet. <Link to="/submit" className="text-blue-600 hover:underline">Start one!</Link></p>
      ) : (
        <div className="space-y-2 mb-8">
          {activity?.recent.discussions.map((d) => (
            <Link
              key={d._id}
              to={`/threads/${d._id}`}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{d.title}</p>
                <p className="text-xs text-gray-400">{d.course}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/meetups"
          className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors text-center"
        >
          <span className="text-3xl block mb-1">📅</span>
          <p className="text-sm font-medium text-gray-700">Study Meetups</p>
        </Link>
        <Link
          to="/resources"
          className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors text-center"
        >
          <span className="text-3xl block mb-1">📚</span>
          <p className="text-sm font-medium text-gray-700">Course Resources</p>
        </Link>
        <Link
          to="/activity"
          className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors text-center"
        >
          <span className="text-3xl block mb-1">📊</span>
          <p className="text-sm font-medium text-gray-700">My Activity</p>
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
