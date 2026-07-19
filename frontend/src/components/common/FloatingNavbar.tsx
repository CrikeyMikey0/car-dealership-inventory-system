/**
 * @file FloatingNavbar.tsx
 * @description Floating bottom navigation bar component.
 *
 * Renders a floating, pill-shaped navbar at the bottom of the page.
 * Adapts links based on authentication state (shows login vs dashboard/logout)
 * and includes a dark/light mode toggle.
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Reusable floating navbar for the application layout.
 */
export const FloatingNavbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path: string) =>
    `flex flex-col items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 rounded-xl md:rounded-full transition-all duration-300 ${isActive(path)
      ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-105'
      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-[80%] max-w-fit">
      <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-indigo-400 dark:border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] dark:shadow-[0_0_20px_rgba(99,102,241,0.6)] rounded-full px-2 py-2 md:px-4 md:py-3 flex items-center justify-center gap-1 md:gap-2">
        <Link to="/" className={navItemClass('/')}>
          <span className="md:hidden text-lg">🏠</span>
          <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">Home</span>
        </Link>
        <Link to="/vehicles" className={navItemClass('/vehicles')}>
          <span className="md:hidden text-lg">🚗</span>
          <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">Vehicles</span>
        </Link>
        <Link to="/about" className={navItemClass('/about')}>
          <span className="md:hidden text-lg">ℹ️</span>
          <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">About Us</span>
        </Link>
        <Link to="/contact" className={navItemClass('/contact')}>
          <span className="md:hidden text-lg">📞</span>
          <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">Contact Us</span>
        </Link>

        <div className="w-px h-8 bg-indigo-200 dark:bg-indigo-800 mx-1 md:mx-2 hidden sm:block"></div>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={navItemClass('/dashboard')}>
              <span className="md:hidden text-lg">📊</span>
              <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">Dashboard</span>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/vehicles/new" className={navItemClass('/vehicles/new')}>
                <span className="md:hidden text-lg">➕</span>
                <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">Add Vehicle</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 rounded-xl md:rounded-full transition-all duration-300 text-rose-500 hover:text-white hover:bg-rose-500"
            >
              <span className="md:hidden text-lg">🚪</span>
              <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">Logout</span>
            </button>
          </>
        ) : (
          <Link to="/login" className={navItemClass('/login')}>
            <span className="md:hidden text-lg">👤</span>
            <span className="hidden md:inline font-semibold text-sm whitespace-nowrap">Login</span>
          </Link>
        )}

        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 rounded-xl md:rounded-full transition-all duration-300 text-slate-500 hover:text-amber-500 hover:bg-amber-100 dark:hover:text-amber-400 dark:hover:bg-slate-800"
          aria-label="Toggle Theme"
        >
          <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </nav>
    </div>
  );
};
