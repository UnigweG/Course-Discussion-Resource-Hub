import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

function SectionHeader({ title }) {
  return <h2 className="text-base font-semibold text-gray-900 mb-3">{title}</h2>;
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
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    );
  }

  const { discussions, comments, resources } = activity?.recent ?? { discussions: [], comments: [], resources: [] };

  return (
    <div>
      <PageHeader title="My Activity" description="Threads, comments, and resources you've contributed." />

      <div className="space-y-8">
        {/* Discussions */}
        <section>
          <SectionHeader title="My Discussions" />
          {discussions.length === 0 ? (
            <p className="text-sm text-gray-400">No discussions yet.</p>
          ) : (
            <div className="space-y-2">
              {discussions.map((d) => (
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
        </section>

        {/* Comments */}
        <section>
          <SectionHeader title="My Comments" />
          {comments.length === 0 ? (
            <p className="text-sm text-gray-400">No comments yet.</p>
          ) : (
            <div className="space-y-2">
              {comments.map((c) => (
                <Link
                  key={c._id}
                  to={`/threads/${c.discussion}`}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <p className="text-sm text-gray-700 truncate max-w-md">{c.body}</p>
                  <span className="text-xs text-gray-400 shrink-0 ml-4">{new Date(c.createdAt).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Resources */}
        <section>
          <SectionHeader title="Resources I Shared" />
          {resources.length === 0 ? (
            <p className="text-sm text-gray-400">No resources shared yet.</p>
          ) : (
            <div className="space-y-2">
              {resources.map((r) => (
                <Link
                  key={r._id}
                  to="/resources"
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.title}</p>
                    <p className="text-xs text-gray-400">{r.course} · {r.type}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ActivityPage;
