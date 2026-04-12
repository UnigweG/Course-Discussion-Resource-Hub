import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

function SubmitDiscussionPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [course, setCourse] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Store the new discussion id so we can render a direct link after posting
  const [postedId, setPostedId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    // Client-side guard — all three fields are required
    if (!title.trim() || !body.trim() || !course.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: title.trim(), body: body.trim(), course: course.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Submission failed. Please try again.');
        return;
      }

      setSuccessMessage(data.message || 'Discussion posted!');
      setPostedId(data.data._id);
      setTitle('');
      setBody('');
      setCourse('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader
        title="Post a Discussion"
        description="Start a new thread for your course."
      />

      <form onSubmit={handleSubmit} className="card rounded-xl p-6 space-y-4">
        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Course <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g. COSC 360"
            className="input"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to discuss?"
            className="input"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Details <span className="text-red-500">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Provide more context, share what you've tried, or ask your question…"
            rows={6}
            className="input"
          />
        </div>

        {/* Feedback messages */}
        {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

        {successMessage && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-3">
            <p className="text-green-700 dark:text-green-400 text-sm font-medium">{successMessage}</p>
            {postedId && (
              <Link
                to={`/threads/${postedId}`}
                className="text-sm text-brand-600 dark:text-brand-400 hover:underline mt-1 inline-block"
              >
                View your discussion →
              </Link>
            )}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
          {loading ? 'Posting…' : 'Post Discussion'}
        </button>
      </form>
    </div>
  );
}

export default SubmitDiscussionPage;
