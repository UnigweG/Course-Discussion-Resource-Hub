import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import FormInput from '../../components/FormInput';
import InlineAlert from '../../components/InlineAlert';

/** Basic field-level validation before the API call. */
function validate(fields) {
  const errors = {};
  if (!fields.email || !/\S+@\S+\.\S+/.test(fields.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  }
  return errors;
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as soon as the user starts typing again
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
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
      const user = await login({ email: fields.email, password: fields.password });
      // Admins go straight to the admin panel
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <PageHeader title="Sign In" description="Welcome back to CourseHub." />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 card rounded-xl p-6"
      >
        <InlineAlert message={submitError} />

        <FormInput
          id="email"
          name="email"
          label="Email"
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
          placeholder="••••••••"
          autoComplete="current-password"
          error={fieldErrors.password}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
