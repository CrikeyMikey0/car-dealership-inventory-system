/**
 * @file ThemeContext.tsx
 * @description React context and provider for dark/light theme management.
 *
 * Persists the theme choice to `localStorage` and applies the theme class
 * to the `<html>` element so Tailwind CSS dark-mode utilities (`dark:*`)
 * activate correctly.
 *
 * Priority order for determining the initial theme:
 *  1. Value stored in `localStorage` (user's explicit previous choice).
 *  2. System `prefers-color-scheme: dark` media query.
 *  3. Falls back to `"dark"` as the application default.
 *
 * Expose the context via the `useTheme` hook exported from this file.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

/** Supported theme values. */
type Theme = 'light' | 'dark';

/**
 * Shape of the theme context value.
 */
interface ThemeContextType {
  /** The currently active theme. */
  theme: Theme;
  /** Toggles between `"light"` and `"dark"`. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme context provider.
 *
 * Reads the initial theme from `localStorage` or system preference, applies
 * it to the document root element, and re-applies it whenever it changes.
 *
 * @param children - The React subtree that can consume `useTheme()`.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Honour a previously saved user preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // 2. Match the OS/browser dark-mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    // 3. Default to dark theme
    return 'dark';
  });

  // Sync the `dark` / `light` class on <html> and persist to localStorage
  // whenever the theme changes.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  /** Switches the active theme between light and dark. */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook that returns the current theme and a toggle function.
 *
 * Must be called inside a component that is a descendant of `ThemeProvider`.
 *
 * @returns `{ theme, toggleTheme }` from `ThemeContext`.
 * @throws {Error} If used outside of a `ThemeProvider`.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
