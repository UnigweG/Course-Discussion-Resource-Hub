import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';

function DiscussionCard({ discussion }) {
  return (
    <li className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/threads/${discussion._id}`}>
        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
          {discussion.title}
        </h3>
      </Link>
      <p className="text-xs text-blue-600 mt-1 font-medium">{discussion.course}</p>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{discussion.body}</p>
      <p className="text-xs text-gray-400 mt-2">
        Posted by {discussion.authorUsername}
      </p>
    </li>
  );
}

function HomePage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the latest discussions from the DB on page load
  useEffect(() => {
    fetch('/api/discussions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDiscussions(data.data.slice(0, 6)); // show 6 most recent
      })
      .catch(() => setError('Could not load discussions.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-16 text-center text-white sm:py-20">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Course Discussion &amp; Resource Hub
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-blue-200 text-lg">
          Ask questions, share resources, and collaborate with your classmates.
        </p>
        <div className="mx-auto mt-8 max-w-md">
          <SearchBar placeholder="Search threads, courses…" />
        </div>
      </section>

      {/* Recent discussions from DB */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Discussions</h2>
          <Link to="/search" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading && (
          <p className="text-sm text-gray-500">Loading discussions…</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && discussions.length === 0 && (
          <p className="text-sm text-gray-500">
            No discussions yet.{' '}
            <Link to="/submit" className="text-blue-600 hover:underline">
              Start one!
            </Link>
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

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-xl font-bold text-gray-900">Ready to get started?</h2>
        <p className="mt-2 text-gray-500">
          Create an account and join the conversation.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
          >
            Create Account
          </Link>
          <Link
            to="/search"
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Browse Threads
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
