import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

/** Single result card — discussions link to the thread, resources/meetups show type badge. */
function ResultCard({ item, type }) {
  const href = type === 'discussions' ? `/threads/${item._id}` : null;

  return (
    <li className="card rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        {href ? (
          <Link to={href}>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {item.title}
            </h3>
          </Link>
        ) : (
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
        )}
        <span className="shrink-0 text-xs rounded-full px-2 py-0.5 font-medium bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 capitalize">
          {type === 'discussions' ? 'Thread' : type === 'resources' ? 'Resource' : 'Meetup'}
        </span>
      </div>
      <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5 font-medium">{item.course}</p>
      {(item.body || item.description) && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
          {item.body || item.description}
        </p>
      )}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {item.authorUsername ? `by ${item.authorUsername}` : item.organizerUsername ? `by ${item.organizerUsername}` : ''}
      </p>
    </li>
  );
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  // results is null before any search, or { discussions, resources, meetups } after
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function runSearch(term) {
    if (!term.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`);
      const data = await res.json();
      setResults(data.results ?? { discussions: [], resources: [], meetups: [] });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Auto-run when page is loaded from the homepage SearchBar with ?q=term.
  // We clear the param so the URL stays clean after the search fires.
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      runSearch(q);
      setSearchParams({}, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const totalCount = results
    ? (results.discussions?.length ?? 0) + (results.resources?.length ?? 0) + (results.meetups?.length ?? 0)
    : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Explore"
        description="Search discussions, resources, and meetups."
      />

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, keyword, or course…"
          className="input flex-1"
        />
        <button type="submit" disabled={loading} className="btn-primary px-5">
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 dark:text-red-400 mb-4 text-sm">{error}</p>}

      {results === null && !loading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Enter a keyword above to search across all content.
        </p>
      )}

      {results !== null && totalCount === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No results found for that search.</p>
      )}

      {results !== null && totalCount > 0 && (
        <div className="space-y-8">
          {[
            { key: 'discussions', label: 'Threads' },
            { key: 'resources',   label: 'Resources' },
            { key: 'meetups',     label: 'Meetups' },
          ].map(({ key, label }) => {
            const items = results[key] ?? [];
            if (items.length === 0) return null;
            return (
              <section key={key}>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  {label} ({items.length})
                </h2>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <ResultCard key={item._id} item={item} type={key} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
