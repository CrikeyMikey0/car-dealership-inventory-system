import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/dashboard" className="text-lg font-bold text-white tracking-tight">
            🚗 Admin Portal
          </Link>
        </div>
        <nav role="navigation" className="flex-1 px-4 py-6 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            Dashboard
          </Link>
          <Link to="/vehicles" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            Vehicles List
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="text-xs text-slate-400 px-2 truncate" title={user?.email}>
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/25"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header role="banner" className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center px-8 justify-between">
          <h2 className="text-sm font-semibold text-slate-400">Inventory Management</h2>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
