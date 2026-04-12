import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
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
      setResults(data.results ?? []);
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

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Explore"
        description="Search discussions across all courses."
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

      {results === null && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Enter a keyword above to find discussions.
        </p>
      )}

      {results !== null && results.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No results found for that search.</p>
      )}

      {results !== null && results.length > 0 && (
        <ul className="space-y-3">
          {results.map((item) => (
            <li key={item._id || item.id} className="card rounded-lg p-4 hover:shadow-md transition-shadow">
              <Link to={`/threads/${item._id || item.id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {item.title}
                </h3>
              </Link>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5 font-medium">{item.course}</p>
              {item.body && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{item.body}</p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">by {item.authorUsername}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchPage;
