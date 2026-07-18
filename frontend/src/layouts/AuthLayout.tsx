import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <div className="max-w-md w-full bg-white/80 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 transition-colors duration-300">
        <div className="text-center space-y-4">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <Logo className="w-12 h-12 text-lg mx-auto" />
          </Link>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{title}</h2>
            {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
