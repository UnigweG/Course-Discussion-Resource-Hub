import { useTheme } from '../contexts/ThemeContext';

/**
 * Simple dark / light mode toggle button shown in the Navbar.
 * Displays a moon icon in light mode (click to go dark) and a sun icon in
 * dark mode (click to go light).
 */
function ThemeSwitcher() {
  const { dark, toggleDark } = useTheme();

  return (
    <button
      onClick={toggleDark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
    >
      {dark ? (
        /* Sun — shown in dark mode */
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        /* Moon — shown in light mode */
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeSwitcher;
