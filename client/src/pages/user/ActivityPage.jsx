import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

function ActivityPage() {
  return (
    <div>
      <PageHeader title="My Activity" description="Threads, comments, and resources you've contributed." />
      <EmptyState
        title="Nothing here yet"
        description="Your contributions will appear here once you start participating."
      />
    </div>
  );
}

export default ActivityPage;
