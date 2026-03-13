import { Link, useLocation } from 'react-router-dom';

const labelMap = {
  search: 'Search',
  threads: 'Threads',
  login: 'Sign In',
  register: 'Register',
  dashboard: 'Dashboard',
  profile: 'Profile',
  activity: 'My Activity',
  meetups: 'Meetups',
  admin: 'Admin',
};

function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const label = labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
    const isLast = i === segments.length - 1;
    return { path, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.path} className="flex items-center gap-1.5">
            <span className="text-gray-300">/</span>
            {c.isLast ? (
              <span className="font-medium text-gray-700">{c.label}</span>
            ) : (
              <Link to={c.path} className="hover:text-brand-600 transition-colors">
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
