import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

/** Small section title used three times below. */
function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {count !== undefined && (
        <span className="text-xs text-gray-600 dark:text-gray-400">{count} item{count !== 1 ? 's' : ''}</span>
      )}
    </div>
  );
}

/** Reusable row card for each activity item. */
function ActivityRow({ to, primary, secondary, date }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-3 card rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{primary}</p>
        {secondary && <p className="text-xs text-gray-600 dark:text-gray-400">{secondary}</p>}
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400 shrink-0 ml-4">
        {new Date(date).toLocaleDateString()}
      </span>
    </Link>
  );
}

function ActivityPage() {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/activity', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setActivity(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="My Activity" description="Threads, comments, and resources you've contributed." />
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
              {[...Array(2)].map((_, j) => (
                <div key={j} className="card rounded-lg p-3 animate-pulse flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { discussions = [], comments = [], resources = [] } = activity?.recent ?? {};

  return (
    <div>
      <PageHeader title="My Activity" description="Threads, comments, and resources you've contributed." />

      <div className="space-y-8">
        {/* My discussions */}
        <section>
          <SectionHeader title="My Discussions" count={discussions.length} />
          {discussions.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No discussions yet.</p>
          ) : (
            <div className="space-y-2">
              {discussions.map((d) => (
                <ActivityRow
                  key={d._id}
                  to={`/threads/${d._id}`}
                  primary={d.title}
                  secondary={d.course}
                  date={d.createdAt}
                />
              ))}
            </div>
          )}
        </section>

        {/* My comments */}
        <section>
          <SectionHeader title="My Comments" count={comments.length} />
          {comments.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No comments yet.</p>
          ) : (
            <div className="space-y-2">
              {comments.map((c) => (
                <ActivityRow
                  key={c._id}
                  to={`/threads/${c.discussion}`}
                  primary={c.body}
                  date={c.createdAt}
                />
              ))}
            </div>
          )}
        </section>

        {/* Resources shared */}
        <section>
          <SectionHeader title="Resources I Shared" count={resources.length} />
          {resources.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No resources shared yet.</p>
          ) : (
            <div className="space-y-2">
              {resources.map((r) => (
                <ActivityRow
                  key={r._id}
                  to="/resources"
                  primary={r.title}
                  secondary={`${r.course} · ${r.type}`}
                  date={r.createdAt}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ActivityPage;
