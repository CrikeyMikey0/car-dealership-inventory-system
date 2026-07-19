/**
 * @file MainLayout.tsx
 * @description Primary public-facing layout with a floating bottom navigation bar.
 *
 * Wraps all public and most authenticated pages.  Provides:
 *  - A centred logo header at the top of the page.
 *  - A gradient background with decorative blurred shapes.
 *  - A scrollable main content area.
 *  - A footer with copyright information.
 *  - A floating, pill-shaped bottom navigation bar that adapts based on
 *    authentication state (shows Dashboard/Logout for authenticated users,
 *    Login for unauthenticated users, and an Add Vehicle link for ADMINs).
 *  - An inline dark/light theme toggle button within the navigation bar.
 *
 * Used by all pages except dashboard/admin pages (which use `DashboardLayout`)
 * and auth pages (which use `AuthLayout`).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { FloatingNavbar } from '../components/common/FloatingNavbar';

/**
 * Public-facing application shell with a floating bottom navigation bar.
 *
 * @param props.children - The page content to render in the main content area.
 */
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-[20%] w-[60%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSkiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />
      </div>

      {/* Top Header - Centered Logo */}
      <header role="banner" className="relative z-10 py-4 flex justify-center items-center border-b border-indigo-400 dark:border-indigo-500 shadow-[0_2px_15px_-3px_rgba(99,102,241,0.5)] bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
        <Link to="/" className="flex flex-col items-center gap-1 group hover:opacity-60 transition-opacity">
          <Logo />
          <span className="text-2xl font-black tracking-widest text-slate-900 dark:text-white uppercase group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            KATA
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full transition-colors duration-300">
        {children}
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="relative border-t border-indigo-400 dark:border-indigo-500 shadow-[0_-2px_15px_-3px_rgba(99,102,241,0.5)] bg-slate-100/50 dark:bg-slate-900/30 pt-12 pb-24 transition-colors duration-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <Logo />
                <span className="text-xl font-black tracking-widest text-slate-900 dark:text-white uppercase">KATA</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Premier car dealership platform offering a seamless and modern car buying experience. Find your dream vehicle today.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Inventory</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/vehicles" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Vehicles</Link></li>
                <li><Link to="/vehicles?category=Electric" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Electric</Link></li>
                <li><Link to="/vehicles?category=SUV" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">SUVs</Link></li>
                <li><Link to="/vehicles?category=Sedan" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sedans</Link></li>
                <li><Link to="/vehicles?category=Coupe" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Coupe</Link></li>
                <li><Link to="/vehicles?category=Truck" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Truck</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-indigo-200 dark:border-indigo-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              &copy; {new Date().getFullYear()} KATA Dealership. All rights reserved.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Created by <a href="https://www.linkedin.com/in/karandave0/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Karan</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Navbar */}
      <FloatingNavbar />
    </div>
  );
};
