import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

const roleLabel = { admin: 'Administrator', user: 'Student' };

function ProfilePage() {
  const { user, isLoading, refreshSession } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // useRef to programmatically trigger the hidden file input
  const fileInputRef = useRef(null);

  function startEditing() {
    setUsername(user.username);
    setAvatarFile(null);
    setAvatarPreview(null);
    setSaveError('');
    setSaveSuccess('');
    setIsEditing(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setSaveError('Please select a valid image file.');
      return;
    }
    setAvatarFile(file);
    // show a preview before uploading
    setAvatarPreview(URL.createObjectURL(file));
    setSaveError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 3) {
      setSaveError('Username must be at least 3 characters.');
      return;
    }
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const formData = new FormData();
      formData.append('username', username.trim());
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) { setSaveError(data.message || 'Update failed.'); return; }

      setSaveSuccess('Profile updated!');
      setIsEditing(false);
      // refresh auth context so navbar and other components see new username/avatar
      await refreshSession();
    } catch {
      setSaveError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <p className="text-sm text-gray-500">You are not signed in.</p>;

  const initials = user.username?.slice(0, 2).toUpperCase() || '??';
  const avatarSrc = avatarPreview || (user.avatar ? `/uploads/${user.avatar}` : null);

  return (
    <div>
      <PageHeader title="Profile" description="Your account details." />

      {saveSuccess && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
          {saveSuccess}
        </div>
      )}

      <div className="max-w-lg rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Avatar header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
          <div className="h-14 w-14 shrink-0 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-blue-700">{initials}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.username}</p>
            <span className="text-xs text-gray-500">{roleLabel[user.role] ?? user.role}</span>
          </div>
        </div>

        {!isEditing ? (
          // View mode
          <div className="px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Email</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Member since</span>
              <span className="text-gray-900">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-500 font-medium">Last login</span>
              <span className="text-gray-900">{formatDate(user.lastLoginAt)}</span>
            </div>
            <button
              onClick={startEditing}
              className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit mode
          <form onSubmit={handleSave} className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              {/* Hidden file input triggered via useRef */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-sm text-blue-600 hover:underline"
              >
                {avatarFile ? avatarFile.name : 'Choose new image…'}
              </button>
            </div>

            {saveError && <p className="text-red-500 text-sm">{saveError}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
