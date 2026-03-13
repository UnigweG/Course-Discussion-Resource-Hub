import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../contexts/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name || 'User'}`}
        description="Your activity overview and quick links."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard label="My Threads" value="0" icon="💬" />
        <StatCard label="Comments" value="0" icon="✏️" />
        <StatCard label="Resources Shared" value="0" icon="📎" />
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
      <EmptyState
        title="No activity yet"
        description="Start a discussion or share a resource to see your activity here."
      />
    </div>
  );
}

export default DashboardPage;
