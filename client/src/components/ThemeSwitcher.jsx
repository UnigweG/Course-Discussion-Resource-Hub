import { useTheme } from '../contexts/ThemeContext';

/**
 * Pill-style dark/light toggle.
 * Shows a sliding knob with sun (light) or moon (dark) icon inside an oval track.
 */
function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM4.25 10a.75.75 0 01-.75.75H2a.75.75 0 010-1.5h1.5A.75.75 0 014.25 10zM15.657 4.343a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.06-1.06l1.06-1.061a.75.75 0 011.06 0zM6.464 13.536a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zM15.657 15.657a.75.75 0 01-1.06 0l-1.061-1.06a.75.75 0 011.06-1.061l1.061 1.06a.75.75 0 010 1.061zM6.464 6.464a.75.75 0 01-1.06 0L4.343 5.404a.75.75 0 011.06-1.06l1.061 1.06a.75.75 0 010 1.06zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
      <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
    </svg>
  );
}

export default function ThemeSwitcher() {
  const { dark, toggleDark } = useTheme();

  return (
    <button
      onClick={toggleDark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        relative flex items-center h-7 w-[3.25rem] rounded-full border
        transition-colors duration-300 focus:outline-none focus-visible:ring-2
        focus-visible:ring-brand-500 focus-visible:ring-offset-2
        ${dark
          ? 'bg-slate-700 border-slate-600'
          : 'bg-brand-100 border-brand-300'}
      `}
    >
      {/* Track labels */}
      <span className={`absolute left-1.5 transition-opacity duration-200 ${dark ? 'opacity-0' : 'opacity-60'} text-brand-600`}>
        <SunIcon />
      </span>
      <span className={`absolute right-1.5 transition-opacity duration-200 ${dark ? 'opacity-60' : 'opacity-0'} text-slate-300`}>
        <MoonIcon />
      </span>

      {/* Sliding knob */}
      <span
        className={`
          absolute flex items-center justify-center
          h-5 w-5 rounded-full shadow-md
          transition-transform duration-300
          ${dark
            ? 'translate-x-[1.625rem] bg-indigo-400 text-slate-900'
            : 'translate-x-0.5 bg-white text-brand-600'}
        `}
      >
        {dark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}
