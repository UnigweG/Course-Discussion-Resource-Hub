import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';

function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';

  return (
    <div>
      <PageHeader
        title="Search"
        description="Find discussions, resources, and meetups across all courses."
      />
      <SearchBar className="mb-8 max-w-lg" placeholder="Search…" />
      {query ? (
        <EmptyState
          title={`No results for "${query}"`}
          description="Try a different search term or browse recent threads."
        />
      ) : (
        <EmptyState
          title="Start searching"
          description="Enter a keyword above to find discussions and resources."
        />
      )}
    </div>
  );
}

export default SearchPage;
