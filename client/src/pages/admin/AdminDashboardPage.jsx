import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';

function AdminDashboardPage() {
  return (
    <div>
      <PageHeader title="Admin Dashboard" description="Platform analytics and moderation tools." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Total Users" value="—" icon="👥" />
        <StatCard label="Total Threads" value="—" icon="💬" />
        <StatCard label="Reports" value="—" icon="🚩" />
        <StatCard label="Resources" value="—" icon="📂" />
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900">Moderation Queue</h2>
      <EmptyState
        title="Queue empty"
        description="Admin analytics and moderation tools will be added in a future step."
      />
    </div>
  );
}

export default AdminDashboardPage;
