import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import FormInput from '../../components/FormInput';
import InlineAlert from '../../components/InlineAlert';

function validate(fields) {
  const errors = {};
  if (!fields.username || fields.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  }
  if (!fields.email || !/\S+@\S+\.\S+/.test(fields.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!fields.password || fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarError, setAvatarError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        username: fields.username.trim(),
        email: fields.email,
        password: fields.password,
        avatar: avatarFile || undefined,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <PageHeader title="Create Account" description="Join CourseHub and start collaborating." />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <InlineAlert message={submitError} />

        <FormInput
          id="username"
          name="username"
          label="Username"
          type="text"
          value={fields.username}
          onChange={handleChange}
          placeholder="janedoe"
          autoComplete="username"
          error={fieldErrors.username}
        />

        <FormInput
          id="email"
          name="email"
          label="University Email"
          type="email"
          value={fields.email}
          onChange={handleChange}
          placeholder="you@university.edu"
          autoComplete="email"
          error={fieldErrors.email}
        />

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          value={fields.password}
          onChange={handleChange}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          error={fieldErrors.password}
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={fields.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />

        {/* Profile picture upload — optional but validated for image type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) { setAvatarFile(null); setAvatarError(''); return; }
              // Client-side file type check before even sending to server
              const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
              if (!allowed.includes(file.type)) {
                setAvatarError('Please select a valid image file (jpg, png, gif, webp).');
                setAvatarFile(null);
                return;
              }
              setAvatarError('');
              setAvatarFile(file);
            }}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
          {avatarError && <p className="mt-1 text-xs text-red-500">{avatarError}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
