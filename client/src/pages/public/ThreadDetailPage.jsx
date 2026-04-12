import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import Breadcrumbs from '../../components/Breadcrumbs';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Fetch the discussion from the server on load
  useEffect(() => {
    fetch(`/api/discussions/${threadId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDiscussion(data.data);
          // Pre-fill edit fields
          setEditTitle(data.data.title);
          setEditBody(data.data.body);
          setEditCourse(data.data.course);
        } else {
          setError('Discussion not found.');
        }
      })
      .catch(() => setError('Could not load this discussion.'))
      .finally(() => setLoading(false));
  }, [threadId]);

  // Check if the current user is the author or an admin
  const canModify =
    isAuthenticated &&
    discussion &&
    (user?.username === discussion.authorUsername || user?.role === 'admin');

  // Save edited discussion via PUT request
  async function handleSave() {
    if (!editTitle.trim() || !editBody.trim() || !editCourse.trim()) {
      setEditError('All fields are required.');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      const res = await fetch(`/api/discussions/${threadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: editTitle.trim(),
          body: editBody.trim(),
          course: editCourse.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.message || 'Update failed.');
        return;
      }
      setDiscussion(data.data);
      setIsEditing(false);
    } catch {
      setEditError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  // Delete discussion via DELETE request then redirect home
  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;
    try {
      const res = await fetch(`/api/discussions/${threadId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/');
      } else {
        setError(data.message || 'Delete failed.');
      }
    } catch {
      setError('Could not delete discussion.');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Breadcrumb — auto-generates from the URL path */}
      <Breadcrumbs />

      {!isEditing ? (
        // --- View mode ---
        <div className="mt-4">
          <PageHeader
            title={discussion.title}
            description={`${discussion.course} · Posted by ${discussion.authorUsername}`}
          />
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="text-gray-700 whitespace-pre-wrap">{discussion.body}</p>
          </div>

          {/* Edit / Delete buttons — only visible to author or admin */}
          {canModify && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        // --- Edit mode ---
        <div className="mt-4 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Discussion</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <input
              type="text"
              value={editCourse}
              onChange={(e) => setEditCourse(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {editError && <p className="text-red-500 text-sm">{editError}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditError(''); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreadDetailPage;
