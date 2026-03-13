import { useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

function ThreadDetailPage() {
  const { threadId } = useParams();

  return (
    <div>
      <PageHeader
        title={`Thread #${threadId}`}
        description="Discussion thread details and comments."
      />
      <EmptyState
        title="Thread view coming soon"
        description="Thread content, comments, and resources will appear here in a future step."
      />
    </div>
  );
}

export default ThreadDetailPage;
