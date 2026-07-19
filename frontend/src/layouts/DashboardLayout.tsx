/**
 * @file DashboardLayout.tsx
 * @description Fixed sidebar layout for authenticated admin/user dashboard pages.
 *
 * Renders a two-column layout:
 *  - Left: fixed-width sidebar with branding, navigation links, user email,
 *          and a logout button.
 *  - Right: flexible main area with a top header and scrollable content slot.
 *
 * Used by: `Dashboard`, `Profile`, `EditProfile`, `ChangePassword`, `AddVehicle`,
 *          `EditVehicle`.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard layout component.
 *
 * Wraps protected page content in a sidebar + main area structure.
 * Handles logout logic internally by calling `useAuth().logout()` and
 * navigating to the login page.
 *
 * @param props.children - The page content to render in the main area.
 */
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Calls the context logout function and redirects to the login page.
   * The logout function clears tokens and user data from storage.
   */
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/home');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar — fixed width, dark background */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/dashboard" className="text-lg font-bold text-white tracking-tight">
            🚗 Admin Portal
          </Link>
        </div>

        {/* Navigation links */}
        <nav role="navigation" className="flex-1 px-4 py-6 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            Dashboard
          </Link>
          <Link to="/vehicles" className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            Vehicles List
          </Link>
        </nav>

        {/* Footer area: user email + logout button */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* Display the current user's email, truncated if too long */}
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

      {/* Main content area */}
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
