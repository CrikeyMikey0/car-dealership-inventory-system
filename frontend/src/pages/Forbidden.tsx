/**
 * @file Forbidden.tsx
 * @description HTTP 403 Forbidden error page.
 *
 * Displayed when an authenticated user attempts to access a route that
 * requires a higher privilege level (e.g., a USER trying to access an ADMIN route).
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Forbidden: React.FC = () => {
  return (
    <div data-testid="forbidden-page" className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 text-3xl font-extrabold">
          403
        </div>
        <h1 className="text-3xl font-bold text-slate-100">Access Forbidden</h1>
        <p className="text-slate-400">
          You do not have permission to access this page. This area is reserved for Administrator accounts only.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
