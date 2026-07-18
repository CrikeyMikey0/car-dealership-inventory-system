import React from 'react';
import { Link } from 'react-router-dom';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <header role="banner" className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white tracking-tight">
            🚗 Dealership
          </Link>
          <nav role="navigation" className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/vehicles" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Vehicles
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      <footer role="contentinfo" className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Car Dealership Inventory System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
