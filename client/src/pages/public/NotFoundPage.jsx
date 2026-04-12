import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-8xl font-extrabold text-brand-600 dark:text-brand-400">404</h1>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Page not found</p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
