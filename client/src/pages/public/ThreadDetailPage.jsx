import { useState, useEffect, useReducer, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import PageHeader from '../../components/PageHeader';

// ─── Comment state reducer ──────────────────────────────────────────────────
// Using useReducer to manage list / loading / error as a single state tree.
// Satisfies the COSC 360 requirement to demonstrate useReducer beyond useState.
const commentReducer = (state, action) => {
  switch (action.type) {
    case 'SET':    return { ...state, list: action.payload, loading: false };
    case 'ADD':    return { ...state, list: [...state.list, action.payload] };
    case 'REMOVE': return { ...state, list: state.list.filter((c) => c._id !== action.payload) };
    default:       return state;
  }
};

function ThreadDetailPage() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Discussion state
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Comment state via reducer + polling interval ref
  const [commentState, dispatch] = useReducer(commentReducer, { list: [], loading: true });
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const pollRef = useRef(null);

  // Load discussion on mount / threadId change
  useEffect(() => {
    fetch(`/api/discussions/${threadId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setDiscussion(data.data);
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

  // Fetch comments immediately and then poll every 5 s for live updates.
  // The interval is cleared via the useRef so it never leaks between renders.
  useEffect(() => {
    const fetchComments = () => {
      fetch(`/api/discussions/${threadId}/comments`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) dispatch({ type: 'SET', payload: data.data });
        })
        .catch(() => {}); // polling; silently skip on network error
    };

    fetchComments();
    pollRef.current = setInterval(fetchComments, 5000);
    return () => clearInterval(pollRef.current); // cleanup on unmount
  }, [threadId]);

  // Whether the current user may edit/delete this discussion
  const canModify =
    isAuthenticated &&
    discussion &&
    (user?.username === discussion.authorUsername || user?.role === 'admin');

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
        body: JSON.stringify({ title: editTitle.trim(), body: editBody.trim(), course: editCourse.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setEditError(data.message || 'Update failed.'); return; }
      setDiscussion(data.data);
      setIsEditing(false);
      toast('Discussion updated.', 'success');
    } catch {
      setEditError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;
    try {
      const res = await fetch(`/api/discussions/${threadId}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        toast('Discussion deleted.', 'success');
        navigate('/');
      } else {
        const d = await res.json();
        setError(d.message || 'Delete failed.');
      }
    } catch {
      setError('Could not delete discussion.');
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/discussions/${threadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ body: commentBody.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'ADD', payload: data.data });
        setCommentBody('');
      }
    } catch {
      // Polling will sync on the next 5-second tick
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleCommentDelete(commentId) {
    try {
      const res = await fetch(`/api/discussions/${threadId}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        dispatch({ type: 'REMOVE', payload: commentId });
        toast('Comment removed.', 'success');
      }
    } catch {}
  }

  // ─── Loading / error states ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="card rounded-lg p-5 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 text-center">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <Link to="/" className="text-brand-600 dark:text-brand-400 hover:underline text-sm">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!isEditing ? (
        <div>
          <PageHeader
            title={discussion.title}
            description={`${discussion.course} · Posted by ${discussion.authorUsername}`}
          />

          {/* Post body */}
          <div className="card rounded-lg p-5">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {discussion.body}
            </p>
          </div>

          {/* Edit / Delete controls (own post or admin) */}
          {canModify && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          )}

          {/* ─── Comments section ─────────────────────────────────────── */}
          <div className="mt-8">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Comments ({commentState.list.length})
            </h2>

            {commentState.list.length === 0 && !commentState.loading ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                No comments yet. Be the first!
              </p>
            ) : (
              <ul className="space-y-3 mb-6">
                {commentState.list.map((c) => (
                  <li key={c._id} className="card rounded-lg px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                          {c.authorUsername}
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{c.body}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {isAuthenticated &&
                        (user?.username === c.authorUsername || user?.role === 'admin') && (
                          <button
                            onClick={() => handleCommentDelete(c._id)}
                            className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-400 shrink-0 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Comment input */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Write a comment…"
                  className="input flex-1"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentBody.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  {submittingComment ? '…' : 'Post'}
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline">
                  Sign in
                </Link>{' '}
                to leave a comment.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* ─── Edit form ───────────────────────────────────────────────── */
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Discussion</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
            <input
              type="text"
              value={editCourse}
              onChange={(e) => setEditCourse(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Details</label>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={5}
              className="input"
            />
          </div>

          {editError && <p className="text-red-500 dark:text-red-400 text-sm">{editError}</p>}

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditError(''); }}
              className="btn-secondary"
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
