import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { FloatingNavbar } from '../components/common/FloatingNavbar';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden p-4">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-[20%] w-[60%] h-[40%] rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSkiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8 flex flex-col items-center justify-center pb-20">
        {/* Back to Home & Logo Header */}
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="group flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <span>&larr;</span> Back to Home
          </Link>
          <Logo />
        </div>

        {/* Glassmorphic Form Card */}
        <div className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-indigo-200 dark:border-indigo-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(99,102,241,0.1)] rounded-3xl p-8 transition-all">
          <div className="text-center mb-6 space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>

      {/* Floating Bottom Navbar */}
      <FloatingNavbar />
    </div>
  );
};

