import { useState, useEffect, useReducer, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';

// useReducer for comment state — covers Exploration requirement
const commentReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, list: action.payload, loading: false };
    case 'ADD':
      return { ...state, list: [...state.list, action.payload] };
    case 'REMOVE':
      return { ...state, list: state.list.filter((c) => c._id !== action.payload) };
    default:
      return state;
  }
};

function ThreadDetailPage() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editCourse, setEditCourse] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [commentState, dispatch] = useReducer(commentReducer, { list: [], loading: true });
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // useRef to hold the polling interval id so we can clear it on unmount
  const pollRef = useRef(null);

  useEffect(() => {
    fetch(`/api/discussions/${threadId}`)
      .then((res) => res.json())
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

  // Fetch comments and poll every 5s for async updates
  useEffect(() => {
    const fetchComments = () => {
      fetch(`/api/discussions/${threadId}/comments`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) dispatch({ type: 'SET', payload: data.data });
        })
        .catch(() => {});
    };
    fetchComments();
    pollRef.current = setInterval(fetchComments, 5000);
    return () => clearInterval(pollRef.current);
  }, [threadId]);

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
      if (res.ok) navigate('/');
      else { const d = await res.json(); setError(d.message || 'Delete failed.'); }
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
      // polling will sync on next tick
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
      if (res.ok) dispatch({ type: 'REMOVE', payload: commentId });
    } catch {}
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
        <Link to="/" className="text-blue-600 hover:underline text-sm">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {!isEditing ? (
        <div>
          <PageHeader
            title={discussion.title}
            description={`${discussion.course} · Posted by ${discussion.authorUsername}`}
          />
          <div className="mt-4 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="text-gray-700 whitespace-pre-wrap">{discussion.body}</p>
          </div>

          {canModify && (
            <div className="mt-4 flex gap-3">
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Edit</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
            </div>
          )}

          {/* Comments section */}
          <div className="mt-8">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Comments ({commentState.list.length})
            </h2>

            {commentState.list.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">No comments yet. Be the first!</p>
            ) : (
              <ul className="space-y-3 mb-6">
                {commentState.list.map((c) => (
                  <li key={c._id} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-medium text-blue-600">{c.authorUsername}</span>
                        <p className="text-sm text-gray-700 mt-1">{c.body}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                      </div>
                      {isAuthenticated && (user?.username === c.authorUsername || user?.role === 'admin') && (
                        <button onClick={() => handleCommentDelete(c._id)} className="text-xs text-red-400 hover:text-red-600 shrink-0">
                          Delete
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Write a comment…"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !commentBody.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submittingComment ? '…' : 'Post'}
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-500">
                <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link> to leave a comment.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Discussion</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <input type="text" value={editCourse} onChange={(e) => setEditCourse(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={5}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {editError && <p className="text-red-500 text-sm">{editError}</p>}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={() => { setIsEditing(false); setEditError(''); }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThreadDetailPage;
