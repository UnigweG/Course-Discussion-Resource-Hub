import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';

/**
 * Root shell for every page.
 * Navbar at top → breadcrumbs → page content → footer.
 * Background and text colours are set in index.css on <body>
 * and switched automatically by the dark class on <html>.
 */
function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Course Discussion &amp; Resource Hub &mdash; A University Project
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
