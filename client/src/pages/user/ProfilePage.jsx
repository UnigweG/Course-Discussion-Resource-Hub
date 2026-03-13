import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Profile" description="View and manage your account details." />
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm max-w-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name || 'Unknown'}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role || 'admin'}</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          Profile editing will be available in a future step.
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
