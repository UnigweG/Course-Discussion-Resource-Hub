import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../contexts/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's personal stats and recent discussions on mount
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
        title={`Welcome back, ${user?.username || 'User'} 👋`}
        description="Your activity overview and quick links."
      />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard label="My Threads"       value={loading ? '…' : (activity?.counts.discussions ?? 0)} icon="💬" />
        <StatCard label="Comments"         value={loading ? '…' : (activity?.counts.comments ?? 0)}   icon="✏️" />
        <StatCard label="Resources Shared" value={loading ? '…' : (activity?.counts.resources ?? 0)}  icon="📎" />
      </div>

      {/* Recent discussions */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Recent Discussions</h2>
        <Link to="/submit" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
          + New Thread
        </Link>
      </div>

      {loading ? (
        /* Skeleton list */
        <div className="space-y-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card rounded-lg p-3 animate-pulse flex justify-between">
              <div className="space-y-1 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-4 shrink-0 mt-1" />
            </div>
          ))}
        </div>
      ) : (activity?.recent.discussions ?? []).length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          No discussions yet.{' '}
          <Link to="/submit" className="text-brand-600 dark:text-brand-400 hover:underline">
            Start one!
          </Link>
        </p>
      ) : (
        <div className="space-y-2 mb-8">
          {activity.recent.discussions.map((d) => (
            <Link
              key={d._id}
              to={`/threads/${d._id}`}
              className="flex items-center justify-between p-3 card rounded-lg hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{d.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{d.course}</p>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 shrink-0 ml-4">
                {new Date(d.createdAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Quick-nav cards */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { to: '/meetups',   icon: '📅', label: 'Study Meetups'    },
          { to: '/resources', icon: '📚', label: 'Course Resources' },
          { to: '/activity',  icon: '📊', label: 'My Activity'      },
        ].map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className="card rounded-xl p-4 hover:shadow-md transition-shadow text-center group"
          >
            <span className="text-3xl block mb-1">{icon}</span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
