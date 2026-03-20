import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const roleLabel = { admin: 'Administrator', user: 'Student' };
const statusColors = {
  active: 'bg-green-100 text-green-700',
  disabled: 'bg-red-100 text-red-700',
};

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500 w-32 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 text-right">{value}</span>
    </div>
  );
}

function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div>
        <PageHeader title="Profile" description="Your account details." />
        <p className="text-sm text-gray-500">You are not signed in.</p>
      </div>
    );
  }

  const initials = user.username?.slice(0, 2).toUpperCase() || '??';

  return (
    <div>
      <PageHeader title="Profile" description="Your account details." />
      <div className="max-w-lg rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Avatar header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700 shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user.username}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                statusColors[user.status] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-2">
          <ProfileRow label="Email" value={user.email} />
          <ProfileRow label="Role" value={roleLabel[user.role] ?? user.role} />
          <ProfileRow label="Member since" value={formatDate(user.createdAt)} />
          <ProfileRow label="Last login" value={formatDate(user.lastLoginAt)} />
        </div>

        <p className="px-6 py-4 text-xs text-gray-400">
          Profile editing will be available in a future step.
        </p>
      </div>
    </div>
  );
}

export default ProfilePage;
