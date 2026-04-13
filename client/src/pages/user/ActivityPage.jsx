import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

/** Build a 14-day activity chart from the items' createdAt dates. */
function ActivityChart({ discussions, comments, resources }) {
  const days = useMemo(() => {
    // Build array of last 14 days (oldest → newest)
    const result = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
    }
    return result;
  }, []);

  const counts = useMemo(() => {
    const map = {};
    days.forEach((d) => { map[d] = 0; });
    const allItems = [
      ...discussions.map((x) => x.createdAt),
      ...comments.map((x) => x.createdAt),
      ...resources.map((x) => x.createdAt),
    ];
    allItems.forEach((ts) => {
      const label = new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (map[label] !== undefined) map[label]++;
    });
    return days.map((d) => ({ label: d, count: map[d] }));
  }, [days, discussions, comments, resources]);

  const max = Math.max(...counts.map((c) => c.count), 1);
  const total = counts.reduce((s, c) => s + c.count, 0);

  if (total === 0) return null;

  return (
    <div className="card rounded-xl p-5 mb-8">
      <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
        Activity — last 14 days
      </h2>
      <div className="flex items-end gap-1 h-20">
        {counts.map(({ label, count }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full rounded-t bg-brand-500 dark:bg-brand-400 transition-all duration-500 min-h-[2px]"
              style={{ height: `${(count / max) * 100}%` }}
            />
            {/* Tooltip on hover */}
            {count > 0 && (
              <span className="absolute -top-6 text-xs bg-gray-800 text-white rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {count} action{count !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        ))}
      </div>
      {/* X-axis labels — show first, middle, last to avoid crowding */}
      <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
        <span>{counts[0].label}</span>
        <span>{counts[6].label}</span>
        <span>{counts[13].label}</span>
      </div>
    </div>
  );
}

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

      <ActivityChart discussions={discussions} comments={comments} resources={resources} />

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
