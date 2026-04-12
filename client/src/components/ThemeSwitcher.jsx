import { useState, useRef, useEffect } from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext';

/**
 * Compact popover that lets the user:
 *  - toggle dark / light mode with a sun / moon button
 *  - pick one of the preset colour themes via swatch circles
 *
 * Closes when the user clicks outside (mousedown listener on document).
 */
function ThemeSwitcher() {
  const { theme, dark, setTheme, toggleDark } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button — shows palette icon */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
        aria-label="Theme settings"
        title="Theme settings"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </button>

      {/* Popover panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700 animate-fade-in z-50 p-3 space-y-3">
          {/* Dark mode toggle row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {dark ? 'Dark mode' : 'Light mode'}
            </span>
            <button
              onClick={toggleDark}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                dark ? 'bg-brand-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  dark ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Colour theme swatches */}
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Colour theme</p>
            <div className="flex gap-2 flex-wrap">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setOpen(false); }}
                  title={t.label}
                  className={`h-6 w-6 rounded-full ${t.swatch} ring-offset-2 ring-offset-white dark:ring-offset-gray-800 transition-all ${
                    theme === t.id ? 'ring-2 ring-gray-900 dark:ring-gray-100 scale-110' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
