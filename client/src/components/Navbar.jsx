import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';

/** Tailwind class string for nav links — active state uses brand colour. */
const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
  }`;

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  // Links visible to everyone
  const publicLinks = [
    { to: '/',       label: 'Home'      },
    { to: '/search', label: 'Explore'   },
  ];

  // Links visible only when logged in
  const userLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/meetups',   label: 'Meetups'   },
    { to: '/resources', label: 'Resources' },
  ];

  // Extra link for admins
  const adminLinks = [{ to: '/admin', label: 'Admin' }];

  const visibleLinks = [
    ...publicLinks,
    ...(isAuthenticated ? userLinks : []),
    ...(isAdmin ? adminLinks : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:bg-gray-900/90 dark:border-gray-700 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-brand-600 text-lg shrink-0"
          >
            {/* Simple book-stack SVG mark */}
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="0" />
            </svg>
            <span className="hidden sm:inline">CourseHub</span>
            <span className="sm:hidden">CH</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {visibleLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Right-side controls */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {/* Theme switcher — palette + dark toggle */}
            <ThemeSwitcher />

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 font-medium transition-colors"
                >
                  {/* Avatar initial bubble */}
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden lg:inline">{user.username}</span>
                  {isAdmin && (
                    <span className="ml-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 px-1.5 py-0.5 text-xs font-medium text-brand-700 dark:text-brand-300">
                      admin
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeSwitcher />
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 md:hidden animate-slide-up">
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
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {user.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-700 dark:text-gray-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-brand-600 dark:text-brand-400 font-medium"
                  >
                    Register
                  </Link>
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
