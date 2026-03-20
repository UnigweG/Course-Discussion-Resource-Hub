import { useState } from 'react';
import PageHeader from '../../components/PageHeader';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data.results);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setQuery('');
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <PageHeader
        title="Search"
        description="Find discussions, resources, and meetups across all courses."
      />

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or course…"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {results === null && (
        <p className="text-gray-500">Enter a keyword above to find discussions and resources.</p>
      )}

      {results !== null && results.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}

      {results !== null && results.length > 0 && (
        <ul className="space-y-4">
          {results.map((item) => (
            <li key={item.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
              <p className="text-sm text-blue-600 mb-1">{item.course}</p>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchPage;
