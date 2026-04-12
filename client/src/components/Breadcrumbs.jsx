import { Link, useLocation } from 'react-router-dom';

/**
 * Maps URL segments to human-readable labels.
 * Segments not in the map fall back to Title Case of the raw segment.
 */
const labelMap = {
  search:     'Explore',
  threads:    'Thread',
  login:      'Sign In',
  register:   'Register',
  dashboard:  'Dashboard',
  profile:    'Profile',
  activity:   'My Activity',
  meetups:    'Meetups',
  resources:  'Resources',
  submit:     'New Discussion',
  admin:      'Admin',
};

function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  // Don't render breadcrumbs on the home page
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    // Use the labelMap if available, otherwise title-case the raw segment
    const label = labelMap[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1));
    const isLast = i === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1.5 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Home
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.path} className="flex items-center gap-1.5">
            <span className="text-gray-400 dark:text-gray-600">/</span>
            {c.isLast ? (
              <span className="font-medium text-gray-600 dark:text-gray-200">{c.label}</span>
            ) : (
              <Link
                to={c.path}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
