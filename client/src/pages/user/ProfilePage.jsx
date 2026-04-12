import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import PageHeader from '../../components/PageHeader';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

const roleLabel = { admin: 'Administrator', user: 'Student' };

function ProfilePage() {
  const { user, isLoading, refreshSession } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // useRef to programmatically trigger the hidden file input without custom styling hacks
  const fileInputRef = useRef(null);

  // Revoke the object URL when a new file is selected or the component unmounts
  // to prevent memory leaks from URL.createObjectURL
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  function startEditing() {
    setUsername(user.username);
    setAvatarFile(null);
    setAvatarPreview(null);
    setSaveError('');
    setIsEditing(true);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setSaveError('Please select a valid image file (jpg, png, gif, webp).');
      return;
    }
    // Revoke previous preview URL before creating a new one
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
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

      setIsEditing(false);
      // Refresh auth context so navbar and other components reflect the new username/avatar
      await refreshSession();
      toast('Profile updated!', 'success');
    } catch {
      setSaveError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-lg space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="card rounded-xl p-6 space-y-3">
          <div className="flex gap-4">
            <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <p className="text-sm text-gray-600">You are not signed in.</p>;

  const initials = user.username?.slice(0, 2).toUpperCase() || '??';
  // avatarPreview is the local preview; user.avatar is the stored filename served at /uploads/
  const avatarSrc = avatarPreview || (user.avatar ? `/uploads/${user.avatar}` : null);

  return (
    <div>
      <PageHeader title="Profile" description="Your account details." />

      <div className="max-w-lg card rounded-xl overflow-hidden">
        {/* Avatar / identity header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="h-16 w-16 shrink-0 rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-brand-700 dark:text-brand-300">{initials}</span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{user.username}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              user.role === 'admin'
                ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>
              {roleLabel[user.role] ?? user.role}
            </span>
          </div>
        </div>

        {!isEditing ? (
          /* View mode */
          <div className="px-6 py-4 space-y-3">
            {[
              { label: 'Email',        value: user.email },
              { label: 'Member since', value: formatDate(user.createdAt) },
              { label: 'Last login',   value: formatDate(user.lastLoginAt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
                <span className="text-gray-900 dark:text-gray-100">{value}</span>
              </div>
            ))}
            <button onClick={startEditing} className="btn-primary w-full mt-2">
              Edit Profile
            </button>
          </div>
        ) : (
          /* Edit mode */
          <form onSubmit={handleSave} className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-3">
                {/* Avatar preview while editing */}
                <div className="h-12 w-12 shrink-0 rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-brand-700 dark:text-brand-300">{initials}</span>
                  )}
                </div>
                {/* Hidden file input triggered by the button via useRef */}
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
                  className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {avatarFile ? avatarFile.name : 'Choose new image…'}
                </button>
              </div>
            </div>

            {saveError && <p className="text-red-500 dark:text-red-400 text-sm">{saveError}</p>}

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary flex-1"
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
