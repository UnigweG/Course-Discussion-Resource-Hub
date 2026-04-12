import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Available colour themes.  Each value maps to a [data-theme] selector in
 * index.css that overrides the --brand-* CSS custom properties.
 */
export const THEMES = [
  { id: 'indigo', label: 'Indigo',  swatch: 'bg-indigo-500'  },
  { id: 'blue',   label: 'Ocean',   swatch: 'bg-blue-500'    },
  { id: 'green',  label: 'Forest',  swatch: 'bg-green-500'   },
  { id: 'rose',   label: 'Rose',    swatch: 'bg-rose-500'    },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Read saved preferences from localStorage, falling back to sensible defaults
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'indigo');
  const [dark, setDarkState] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    // Respect the OS preference on first visit
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme + dark-mode class to <html> whenever they change
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    html.classList.toggle('dark', dark);
    localStorage.setItem('theme', theme);
    localStorage.setItem('darkMode', String(dark));
  }, [theme, dark]);

  const setTheme = useCallback((id) => setThemeState(id), []);
  const toggleDark = useCallback(() => setDarkState((d) => !d), []);

  return (
    <ThemeContext.Provider value={{ theme, dark, setTheme, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
