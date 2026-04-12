import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl leading-none ${n <= value ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function MeetupCard({ meetup, currentUser, onRsvp, onFeedback }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRsvpd = currentUser && meetup.rsvps.some((r) => r.user === currentUser._id);
  const hasFeedback = currentUser && meetup.feedback.some((f) => f.user === currentUser._id);
  const isPast = new Date(meetup.date) < new Date();
  const avgRating =
    meetup.feedback.length > 0
      ? (meetup.feedback.reduce((sum, f) => sum + f.rating, 0) / meetup.feedback.length).toFixed(1)
      : null;

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    await onFeedback(meetup._id, rating, comment);
    setShowFeedback(false);
    setRating(0);
    setComment('');
    setSubmitting(false);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{meetup.title}</h3>
          <p className="text-xs text-blue-600 mt-0.5">{meetup.course} · by {meetup.organizerUsername}</p>
        </div>
        {avgRating && (
          <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-full shrink-0">
            ★ {avgRating}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3">{meetup.description}</p>

      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
        <span>📍 {meetup.location}</span>
        <span>🗓 {new Date(meetup.date).toLocaleString()}</span>
        <span>👥 {meetup.rsvps.length} attending</span>
      </div>

      {currentUser && (
        <div className="flex flex-wrap gap-2">
          {!isPast && (
            <button
              onClick={() => onRsvp(meetup._id, isRsvpd ? 'leave' : 'join')}
              className={`text-sm px-4 py-1.5 rounded-md font-medium transition-colors ${
                isRsvpd
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isRsvpd ? 'Cancel RSVP' : 'RSVP'}
            </button>
          )}

          {isPast && isRsvpd && !hasFeedback && (
            <button
              onClick={() => setShowFeedback((v) => !v)}
              className="text-sm px-4 py-1.5 rounded-md font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
            >
              Leave Feedback
            </button>
          )}

          {hasFeedback && (
            <span className="text-xs text-green-600 font-medium self-center">✓ Feedback submitted</span>
          )}
        </div>
      )}

      {showFeedback && (
        <form onSubmit={handleFeedbackSubmit} className="mt-4 border-t border-gray-100 pt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Comment (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!rating || submitting}
              className="text-sm px-4 py-1.5 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => setShowFeedback(false)}
              className="text-sm px-4 py-1.5 rounded-md font-medium text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function CreateMeetupModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', description: '', course: '', location: '', date: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.course || !form.location || !form.date) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await onCreate(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create meetup.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule a Meetup</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g. COSC 360 Midterm Study Session' },
            { name: 'course', label: 'Course', type: 'text', placeholder: 'e.g. COSC 360' },
            { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Library Room 201 or Zoom link' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
              placeholder="What will you cover? Who should come?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating…' : 'Create Meetup'}
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

function MeetupsPage() {
  const { user } = useAuth();
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetch('/api/meetups', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (d.success) setMeetups(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(formData) {
    const res = await fetch('/api/meetups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create.');
    setMeetups((prev) => [data.data, ...prev]);
  }

  async function handleRsvp(meetupId, action) {
    const res = await fetch(`/api/meetups/${meetupId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setMeetups((prev) => prev.map((m) => m._id === meetupId ? data.data : m));
    }
  }

  async function handleFeedback(meetupId, rating, comment) {
    const res = await fetch(`/api/meetups/${meetupId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setMeetups((prev) => prev.map((m) => m._id === meetupId ? data.data : m));
    }
  }

  const now = new Date();
  const filtered = meetups.filter((m) =>
    filter === 'upcoming' ? new Date(m.date) >= now : new Date(m.date) < now
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <PageHeader
          title="Study Meetups"
          description="Browse upcoming study sessions, RSVP, and share feedback."
        />
        <button
          onClick={() => setShowCreate(true)}
          className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Schedule Meetup
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 mt-4">
        {['upcoming', 'past'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 px-4 text-sm font-medium capitalize border-b-2 transition-colors ${
              filter === f ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading meetups…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">
          {filter === 'upcoming' ? 'No upcoming meetups. Be the first to schedule one!' : 'No past meetups yet.'}
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <MeetupCard
              key={m._id}
              meetup={m}
              currentUser={user}
              onRsvp={handleRsvp}
              onFeedback={handleFeedback}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <CreateMeetupModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}

export default MeetupsPage;
