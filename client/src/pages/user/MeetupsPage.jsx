import PageHeader from '../../components/PageHeader';
import EmptyState from '../../components/EmptyState';

function MeetupsPage() {
  return (
    <div>
      <PageHeader title="Study Meetups" description="Browse and join upcoming study sessions." />
      <EmptyState
        title="No meetups scheduled"
        description="Meetup creation and scheduling will be available in a future step."
      />
    </div>
  );
}

export default MeetupsPage;
