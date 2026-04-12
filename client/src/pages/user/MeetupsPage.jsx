import { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

// ─── Star rating picker ──────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl leading-none transition-colors ${
            n <= value ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-600 hover:text-yellow-400'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Single meetup card ──────────────────────────────────────────────────────
function MeetupCard({ meetup, currentUser, onRsvp, onFeedback }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRsvpd    = currentUser && meetup.rsvps.some((r) => r.user === currentUser._id);
  const hasFeedback = currentUser && meetup.feedback.some((f) => f.user === currentUser._id);
  const isPast      = new Date(meetup.date) < new Date();
  const avgRating   = meetup.feedback.length > 0
    ? (meetup.feedback.reduce((s, f) => s + f.rating, 0) / meetup.feedback.length).toFixed(1)
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
    <div className="card rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{meetup.title}</h3>
          <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">
            {meetup.course} · by {meetup.organizerUsername}
          </p>
        </div>
        {avgRating && (
          <span className="text-xs font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full shrink-0">
            ★ {avgRating}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{meetup.description}</p>

      <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
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
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100'
                  : 'btn-primary'
              }`}
            >
              {isRsvpd ? 'Cancel RSVP' : 'RSVP'}
            </button>
          )}
          {isPast && isRsvpd && !hasFeedback && (
            <button
              onClick={() => setShowFeedback((v) => !v)}
              className="text-sm px-4 py-1.5 rounded-md font-medium bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100 transition-colors"
            >
              Leave Feedback
            </button>
          )}
          {hasFeedback && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium self-center">
              ✓ Feedback submitted
            </span>
          )}
        </div>
      )}

      {/* Inline feedback form */}
      {showFeedback && (
        <form onSubmit={handleFeedbackSubmit} className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Comment <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              maxLength={500}
              className="input"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={!rating || submitting} className="btn-primary">
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
            <button type="button" onClick={() => setShowFeedback(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Create meetup modal ─────────────────────────────────────────────────────
function CreateMeetupModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', description: '', course: '', location: '', date: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card rounded-xl w-full max-w-lg p-6 animate-slide-up">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Schedule a Meetup
        </h2>
        {error && <p className="text-sm text-red-500 dark:text-red-400 mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'title',    label: 'Title',    placeholder: 'e.g. COSC 360 Midterm Study Session' },
            { name: 'course',   label: 'Course',   placeholder: 'e.g. COSC 360' },
            { name: 'location', label: 'Location', placeholder: 'Library Room 201 or Zoom link' },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type="text" name={name} value={form[name]} onChange={onChange}
                placeholder={placeholder} className="input" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date &amp; Time</label>
            <input type="datetime-local" name="date" value={form.date} onChange={onChange} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={3}
              maxLength={1000} placeholder="What will you cover?" className="input" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-2">
              {loading ? 'Creating…' : 'Create Meetup'}
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
function MeetupsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
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
    if (!res.ok) throw new Error(data.message || 'Failed to create meetup.');
    setMeetups((prev) => [data.data, ...prev]);
    toast('Meetup created!', 'success');
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
      toast(action === 'join' ? 'RSVP confirmed!' : 'RSVP cancelled.', 'info');
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
      toast('Feedback submitted!', 'success');
    }
  }

  const now = new Date();
  const filtered = meetups.filter((m) =>
    filter === 'upcoming' ? new Date(m.date) >= now : new Date(m.date) < now
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <PageHeader
          title="Study Meetups"
          description="Browse upcoming study sessions, RSVP, and share feedback."
        />
        {user && (
          <button onClick={() => setShowCreate(true)} className="btn-primary shrink-0">
            + Schedule
          </button>
        )}
      </div>

      {/* Upcoming / Past tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 mt-4">
        {['upcoming', 'past'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 px-4 text-sm font-medium capitalize border-b-2 transition-colors ${
              filter === f
                ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card rounded-xl p-5 animate-pulse space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-12">
          {filter === 'upcoming'
            ? 'No upcoming meetups. Be the first to schedule one!'
            : 'No past meetups yet.'}
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
