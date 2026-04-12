import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

const TYPE_LABELS = { link: '🔗', pdf: '📄', video: '🎥', note: '📝', other: '📦' };

function ResourceCard({ resource, currentUser, onUpvote, onDelete }) {
  const hasUpvoted = currentUser && resource.upvotes.includes(currentUser._id);
  const canDelete =
    currentUser && (currentUser._id === resource.author || currentUser.role === 'admin');

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
      <span className="text-2xl mt-0.5">{TYPE_LABELS[resource.type] || '📦'}</span>
      <div className="flex-1 min-w-0">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:underline text-sm truncate block"
        >
          {resource.title}
        </a>
        <p className="text-xs text-gray-500 mt-0.5">{resource.course} · by {resource.authorUsername}</p>
        {resource.description && (
          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
        )}
      </div>
      <div className="flex flex-col items-center gap-2 shrink-0">
        <button
          onClick={() => onUpvote(resource._id)}
          disabled={!currentUser}
          className={`flex flex-col items-center text-xs font-medium px-2 py-1 rounded-md transition-colors ${
            hasUpvoted
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          } disabled:opacity-40`}
        >
          <span className="text-base leading-none">▲</span>
          {resource.upvotes.length}
        </button>
        {canDelete && (
          <button
            onClick={() => onDelete(resource._id)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

function AddResourceModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', url: '', type: 'link', course: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Share a Resource</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. COSC 360 Lecture Notes Week 5"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="https://…"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <input
                type="text"
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g. COSC 360"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="link">Link</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="note">Note</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              maxLength={600}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding…' : 'Add Resource'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  function fetchResources(course = '') {
    const url = course ? `/api/resources?course=${encodeURIComponent(course)}` : '/api/resources';
    fetch(url, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setResources(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchResources(courseFilter);
  }, [courseFilter]);

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
  }

  async function handleUpvote(id) {
    const res = await fetch(`/api/resources/${id}/upvote`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setResources((prev) => prev.map((r) => r._id === id ? data.data : r));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this resource?')) return;
    const res = await fetch(`/api/resources/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) setResources((prev) => prev.filter((r) => r._id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <PageHeader
          title="Course Resources"
          description="Share and discover helpful links, notes, and videos."
        />
        {user && (
          <button
            onClick={() => setShowAdd(true)}
            className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Resource
          </button>
        )}
      </div>

      <div className="mt-4 mb-6">
        <input
          type="text"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          placeholder="Filter by course (e.g. COSC 360)…"
          className="w-full max-w-sm border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading resources…</p>
      ) : resources.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">
          No resources found. {user ? 'Be the first to share one!' : 'Log in to share resources.'}
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
