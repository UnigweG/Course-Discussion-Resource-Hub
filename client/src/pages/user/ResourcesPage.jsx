import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

/** Emoji icon per resource type for quick visual identification. */
const TYPE_ICONS = { link: '🔗', pdf: '📄', video: '🎥', note: '📝', other: '📦' };

// ─── Single resource card ────────────────────────────────────────────────────
function ResourceCard({ resource, currentUser, onUpvote, onDelete }) {
  const hasUpvoted = currentUser && resource.upvotes.includes(currentUser._id);
  const canDelete  = currentUser && (currentUser._id === resource.author || currentUser.role === 'admin');

  return (
    <div className="card rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
      <span className="text-2xl mt-0.5 shrink-0">{TYPE_ICONS[resource.type] ?? '📦'}</span>

      <div className="flex-1 min-w-0">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 dark:text-brand-400 hover:underline text-sm truncate block"
        >
          {resource.title}
        </a>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          {resource.course} · by {resource.authorUsername}
        </p>
        {resource.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
        )}
      </div>

      {/* Upvote + delete column */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <button
          onClick={() => onUpvote(resource._id)}
          disabled={!currentUser}
          title={currentUser ? 'Upvote' : 'Sign in to upvote'}
          className={`flex flex-col items-center text-xs font-medium px-2 py-1 rounded-md transition-colors ${
            hasUpvoted
              ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
          } disabled:opacity-40`}
        >
          <span className="text-base leading-none">▲</span>
          {resource.upvotes.length}
        </button>
        {canDelete && (
          <button
            onClick={() => onDelete(resource._id)}
            className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Add resource modal ──────────────────────────────────────────────────────
function AddResourceModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', url: '', type: 'link', course: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.url || !form.course) {
      setError('Title, URL, and course are required.');
      return;
    }
    setLoading(true);
    try {
      await onAdd(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add resource.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card rounded-xl w-full max-w-lg p-6 animate-slide-up">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Share a Resource</h2>
        {error && <p className="text-sm text-red-500 dark:text-red-400 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input type="text" name="title" value={form.title} onChange={onChange}
              placeholder="e.g. COSC 360 Lecture Notes Week 5" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
            <input type="url" name="url" value={form.url} onChange={onChange}
              placeholder="https://…" className="input" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
              <input type="text" name="course" value={form.course} onChange={onChange}
                placeholder="e.g. COSC 360" className="input" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select name="type" value={form.type} onChange={onChange} className="input">
                <option value="link">Link</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="note">Note</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <textarea name="description" value={form.description} onChange={onChange}
              rows={2} maxLength={600} className="input" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-2">
              {loading ? 'Adding…' : 'Add Resource'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
function ResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  function fetchResources(course = '') {
    const url = course ? `/api/resources?course=${encodeURIComponent(course)}` : '/api/resources';
    setLoading(true);
    fetch(url, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setResources(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchResources(courseFilter); }, [courseFilter]);

  async function handleAdd(formData) {
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed.');
    setResources((prev) => [data.data, ...prev]);
    toast('Resource added!', 'success');
  }

  async function handleUpvote(id) {
    const res = await fetch(`/api/resources/${id}/upvote`, { method: 'POST', credentials: 'include' });
    const data = await res.json();
    if (res.ok && data.success) setResources((prev) => prev.map((r) => r._id === id ? data.data : r));
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this resource?')) return;
    const res = await fetch(`/api/resources/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      setResources((prev) => prev.filter((r) => r._id !== id));
      toast('Resource removed.', 'info');
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <PageHeader
          title="Course Resources"
          description="Share and discover helpful links, notes, and videos."
        />
        {user && (
          <button onClick={() => setShowAdd(true)} className="btn-primary shrink-0">
            + Add Resource
          </button>
        )}
      </div>

      {/* Course filter */}
      <div className="mt-4 mb-6">
        <input
          type="text"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          placeholder="Filter by course (e.g. COSC 360)…"
          className="input max-w-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card rounded-xl p-4 flex gap-4 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-12">
          No resources found.{' '}
          {user ? 'Be the first to share one!' : 'Log in to share resources.'}
        </p>
      ) : (
        <div className="space-y-3">
          {resources.map((r) => (
            <ResourceCard
              key={r._id}
              resource={r}
              currentUser={user}
              onUpvote={handleUpvote}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddResourceModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}

export default ResourcesPage;
