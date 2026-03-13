import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm">
      <PageHeader title="Create Account" description="Join CourseHub and start collaborating." />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            University Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="you@university.edu"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Create Account
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
