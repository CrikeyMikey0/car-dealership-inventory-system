import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from '../components/common/Logo';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive(path)
        ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-500/30'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Header */}
      <header role="banner" className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
            <Logo />
            <span className="hidden sm:inline-block">KATA</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav role="navigation" className="hidden md:flex items-center gap-2">
              <Link to="/" className={linkClass('/')}>
                Home
              </Link>
              <Link to="/vehicles" className={linkClass('/vehicles')}>
                Vehicles
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={linkClass('/dashboard')}>
                    Dashboard
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link to="/vehicles/new" className={linkClass('/vehicles/new')}>
                      Add Vehicle
                    </Link>
                  )}
                  <Link to="/profile" className={linkClass('/profile')}>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-2 rounded-lg transition-colors ml-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={linkClass('/login')}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 px-4 py-2 rounded-lg shadow-md transition-all ml-2"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 transition-colors duration-300">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/')}`}>
              Home
            </Link>
            <Link to="/vehicles" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/vehicles')}`}>
              Vehicles
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/dashboard')}`}>
                  Dashboard
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/vehicles/new" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/vehicles/new')}`}>
                    Add Vehicle
                  </Link>
                )}
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/profile')}`}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/login')}`}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/register')}`}>
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full transition-colors duration-300">{children}</main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-950 py-8 text-center text-sm text-slate-500 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-600 dark:text-slate-400">&copy; 2026 KATA</p>
          <p>All Rights Reserved.</p>
          <p>Created by Karan</p>
        </div>
      </footer>
    </div>
  );
};
