import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

// ─── Collapsible result card ─────────────────────────────────────────────────
function ResultCard({ item, type }) {
  const [expanded, setExpanded] = useState(false);
  const href = type === 'discussions' ? `/threads/${item._id}` : null;
  const body = item.body || item.description;

  return (
    <li className="card rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      {/* Header — always visible, click to expand */}
      <button
        className="w-full text-left px-4 pt-4 pb-3 flex items-start justify-between gap-2 focus:outline-none"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            {href ? (
              <Link
                to={href}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {item.title}
              </Link>
            ) : (
              <span className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</span>
            )}
            <span className="shrink-0 text-xs rounded-full px-2 py-0.5 font-medium bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 capitalize">
              {type === 'discussions' ? 'Thread' : type === 'resources' ? 'Resource' : 'Meetup'}
            </span>
          </div>
          <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5 font-medium">{item.course}</p>
          {!expanded && body && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-1">{body}</p>
          )}
        </div>
        {/* Chevron */}
        <svg
          className={`h-4 w-4 shrink-0 mt-1 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3 animate-fade-in">
          {body && (
            <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{body}</p>
          )}
          {item.location && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">📍 {item.location}</p>
          )}
          {item.date && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              🗓 {new Date(item.date).toLocaleString()}
            </p>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 dark:text-brand-400 hover:underline mt-2 inline-block"
            >
              Open resource →
            </a>
          )}
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {item.authorUsername
              ? `by ${item.authorUsername}`
              : item.organizerUsername
              ? `by ${item.organizerUsername}`
              : ''}
          </p>
          {href && (
            <Link
              to={href}
              className="text-sm text-brand-600 dark:text-brand-400 hover:underline mt-2 inline-block"
            >
              View full thread →
            </Link>
          )}
        </div>
      )}
    </li>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  const runSearch = useCallback(async (term) => {
    setLoading(true);
    setError('');
    try {
      const url = term.trim()
        ? `/api/search?q=${encodeURIComponent(term.trim())}`
        : '/api/search';
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.results ?? { discussions: [], resources: [], meetups: [] });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount — use URL param if present, otherwise load all recent content
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setSearchParams({}, { replace: true });
      runSearch(q);
    } else {
      runSearch('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced live search — fires 300 ms after the user stops typing
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    runSearch(query);
  };

  const totalCount = results
    ? (results.discussions?.length ?? 0) + (results.resources?.length ?? 0) + (results.meetups?.length ?? 0)
    : 0;

  const isFiltered = query.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Explore"
        description="Browse or search discussions, resources, and meetups."
      />

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder="Type to search by title, keyword, or course…"
          className="input flex-1"
        />
        <button type="submit" disabled={loading} className="btn-primary px-5">
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 dark:text-red-400 mb-4 text-sm">{error}</p>}

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card rounded-lg p-4 animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {!loading && results !== null && totalCount === 0 && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {isFiltered ? `No results found for "${query}".` : 'No content yet.'}
        </p>
      )}

      {!loading && results !== null && totalCount > 0 && (
        <>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            {isFiltered
              ? `${totalCount} result${totalCount !== 1 ? 's' : ''} for "${query}" — click any card to expand`
              : `${totalCount} item${totalCount !== 1 ? 's' : ''} — click any card to expand`}
          </p>
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
                  <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
                    {label} ({items.length})
                  </h2>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <ResultCard key={item._id} item={item} type={key} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
