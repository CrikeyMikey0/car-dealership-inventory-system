import React from 'react';
import { Link } from 'react-router-dom';

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-950 text-slate-50">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="text-3xl font-extrabold text-white tracking-tight">
            🚗 Dealership
          </Link>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
