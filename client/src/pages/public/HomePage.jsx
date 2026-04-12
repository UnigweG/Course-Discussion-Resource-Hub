import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';

/** Single discussion preview card used in both the recent and hot lists. */
function DiscussionCard({ discussion, commentCount }) {
  return (
    <li className="card rounded-lg p-4 hover:shadow-md transition-shadow">
      <Link to={`/threads/${discussion._id}`}>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2">
          {discussion.title}
        </h3>
      </Link>
      <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">{discussion.course}</p>
      {discussion.body && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{discussion.body}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400 dark:text-gray-500">by {discussion.authorUsername}</p>
        {commentCount !== undefined && (
          <span className="text-xs text-gray-400 dark:text-gray-500">💬 {commentCount}</span>
        )}
      </div>
    </li>
  );
}

function HomePage() {
  const [discussions, setDiscussions] = useState([]);
  const [hotThreads, setHotThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch recent and hot discussions in parallel
    Promise.all([
      fetch('/api/discussions').then((r) => r.json()),
      fetch('/api/discussions/hot').then((r) => r.json()),
    ])
      .then(([recentData, hotData]) => {
        if (recentData.success) setDiscussions(recentData.data.slice(0, 6));
        if (hotData.success) setHotThreads(hotData.data);
      })
      .catch(() => setError('Could not load discussions.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero ─────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-16 text-center text-white sm:py-20">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Course Discussion &amp; Resource Hub
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-200 text-lg">
          Ask questions, share resources, and collaborate with your classmates.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <SearchBar placeholder="Search threads, courses…" />
        </div>
      </section>

      {/* Main two-column grid ─────────────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-3">

        {/* Recent discussions (wide column) */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Discussions</h2>
            <Link to="/search" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
              View all →
            </Link>
          </div>

          {loading && (
            /* Loading skeleton rows */
            <ul className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <li key={i} className="card rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </li>
              ))}
            </ul>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && discussions.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No discussions yet.{' '}
              <Link to="/submit" className="text-brand-600 dark:text-brand-400 hover:underline">Start one!</Link>
            </p>
          )}

          {!loading && discussions.length > 0 && (
            <ul className="space-y-3">
              {discussions.map((d) => (
                <DiscussionCard key={d._id} discussion={d} />
              ))}
            </ul>
          )}
        </section>

        {/* Sidebar ─────────────────────────────────────────────────── */}
        <aside className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">🔥 Hot This Week</h2>
            {loading ? (
              <ul className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="card rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </li>
                ))}
              </ul>
            ) : hotThreads.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">No activity this week yet.</p>
            ) : (
              <ul className="space-y-3">
                {hotThreads.map((d) => (
                  <DiscussionCard key={d._id} discussion={d} commentCount={d.commentCount} />
                ))}
              </ul>
            )}
          </section>

          {/* Quick links */}
          <section className="space-y-2">
            <Link
              to="/meetups"
              className="flex items-center gap-3 card rounded-lg p-3 hover:shadow-md transition-shadow text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              <span className="text-xl">📅</span> Study Meetups
            </Link>
            <Link
              to="/resources"
              className="flex items-center gap-3 card rounded-lg p-3 hover:shadow-md transition-shadow text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              <span className="text-xl">📚</span> Course Resources
            </Link>
            <Link
              to="/submit"
              className="flex items-center gap-3 card rounded-lg p-3 hover:shadow-md transition-shadow text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              <span className="text-xl">✏️</span> Post a Discussion
            </Link>
          </section>
        </aside>
      </div>

      {/* CTA ──────────────────────────────────────────────────────────── */}
      <section className="text-center py-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ready to get started?</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Create an account and join the conversation.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/register"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-700 transition-colors"
          >
            Create Account
          </Link>
          <Link
            to="/search"
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Browse Threads
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
