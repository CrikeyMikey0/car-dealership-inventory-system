import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from '../components/common/Logo';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItemClass = (path: string) =>
    `flex flex-col items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 rounded-xl md:rounded-full transition-all duration-300 ${
      isActive(path)
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-[20%] w-[60%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSkiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />
      </div>

      {/* Top Header - Centered Logo */}
      <header role="banner" className="relative z-10 pt-8 pb-4 flex justify-center items-center">
        <Link to="/" className="flex flex-col items-center gap-2 group hover:opacity-90 transition-opacity">
          <Logo />
          <span className="text-2xl font-black tracking-widest text-slate-900 dark:text-white uppercase group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            KATA
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full transition-colors duration-300 pb-32">
        {children}
      </main>

      {/* Footer (Reduced since nav is bottom) */}
      <footer role="contentinfo" className="relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 bg-transparent py-8 text-center text-sm text-slate-500 mb-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-600 dark:text-slate-400">&copy; 2026 KATA</p>
          <p>Created by Karan</p>
        </div>
      </footer>

      {/* Floating Bottom Navbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-fit">
        <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 rounded-full px-2 py-2 md:px-4 md:py-3 flex items-center justify-center gap-1 md:gap-2">
          <Link to="/" className={navItemClass('/')}>
            <span className="md:hidden text-lg">🏠</span>
            <span className="hidden md:inline font-semibold text-sm">Home</span>
          </Link>
          <Link to="/vehicles" className={navItemClass('/vehicles')}>
            <span className="md:hidden text-lg">🚗</span>
            <span className="hidden md:inline font-semibold text-sm">Vehicles</span>
          </Link>
          <Link to="/about" className={navItemClass('/about')}>
            <span className="md:hidden text-lg">ℹ️</span>
            <span className="hidden md:inline font-semibold text-sm">About Us</span>
          </Link>
          <Link to="/contact" className={navItemClass('/contact')}>
            <span className="md:hidden text-lg">📞</span>
            <span className="hidden md:inline font-semibold text-sm">Contact Us</span>
          </Link>

          <div className="w-px h-8 bg-slate-300 dark:bg-slate-700 mx-1 md:mx-2 hidden sm:block"></div>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={navItemClass('/dashboard')}>
                <span className="md:hidden text-lg">📊</span>
                <span className="hidden md:inline font-semibold text-sm">Dashboard</span>
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/vehicles/new" className={navItemClass('/vehicles/new')}>
                  <span className="md:hidden text-lg">➕</span>
                  <span className="hidden md:inline font-semibold text-sm">Add Vehicle</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex flex-col items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 rounded-xl md:rounded-full transition-all duration-300 text-rose-500 hover:text-white hover:bg-rose-500"
              >
                <span className="md:hidden text-lg">🚪</span>
                <span className="hidden md:inline font-semibold text-sm">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className={navItemClass('/login')}>
              <span className="md:hidden text-lg">👤</span>
              <span className="hidden md:inline font-semibold text-sm">Login</span>
            </Link>
          )}

          {/* Theme Toggle Button inline in navbar */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-4 md:py-2 rounded-xl md:rounded-full transition-all duration-300 text-slate-500 hover:text-amber-500 hover:bg-amber-100 dark:hover:text-amber-400 dark:hover:bg-slate-800"
            aria-label="Toggle Theme"
          >
            <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
