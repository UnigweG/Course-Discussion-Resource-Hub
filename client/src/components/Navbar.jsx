import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-100 text-brand-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`;

function Navbar() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDemoLogin = () => {
    login({ name: 'Admin User', role: 'admin' });
    setMobileOpen(false);
  };

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Search' },
  ];

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/meetups', label: 'Meetups' },
  ];

  const adminLinks = [{ to: '/admin', label: 'Admin' }];

  const visibleLinks = [
    ...publicLinks,
    ...(isAuthenticated ? userLinks : []),
    ...(user?.role === 'admin' ? adminLinks : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-brand-600 text-lg">
            <span className="hidden sm:inline">CourseHub</span>
            <span className="sm:hidden">CH</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {visibleLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Auth actions */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-500">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                >
                  Register
                </Link>
                <button
                  onClick={handleDemoLogin}
                  className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Demo Admin
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {visibleLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
                >
                  Logout ({user.name})
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-gray-700">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm text-brand-600 font-medium">
                    Register
                  </Link>
                  <button onClick={handleDemoLogin} className="text-xs text-gray-400">
                    Demo Admin
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
