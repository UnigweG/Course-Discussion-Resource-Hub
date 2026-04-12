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
  const [postedId, setPostedId] = useState(null); // store the new discussion id for linking

  async function handleSubmit(e) {
    e.preventDefault();

    // Basic client-side validation before hitting the server
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
        credentials: 'include', // send auth cookie
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          course: course.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Submission failed. Please try again.');
        return;
      }

      // Show success and store the new discussion id so user can navigate to it
      setSuccessMessage(data.message);
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
    <div className="max-w-xl mx-auto py-8 px-4">
      <PageHeader
        title="Post a Discussion"
        description="Start a new discussion for your course."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g. COSC 360"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Title field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to discuss?"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Body field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Details <span className="text-red-500">*</span>
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Provide more context…"
            required
            rows={5}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error and success messages */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-700 text-sm font-medium">{successMessage}</p>
            {postedId && (
              <Link
                to={`/threads/${postedId}`}
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                View your discussion →
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Posting…' : 'Post Discussion'}
        </button>
      </form>
    </div>
  );
}

export default SubmitDiscussionPage;
