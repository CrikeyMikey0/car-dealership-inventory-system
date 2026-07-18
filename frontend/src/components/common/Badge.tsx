import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'indigo' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border';

  const variants = {
    primary: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 backdrop-blur-md shadow-sm',
    secondary: 'bg-slate-500/15 text-slate-300 border-slate-500/30 backdrop-blur-md',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 backdrop-blur-md',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30 backdrop-blur-md',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30 backdrop-blur-md',
    indigo: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 backdrop-blur-md',
    slate: 'bg-slate-500/15 text-slate-300 border-slate-500/30 backdrop-blur-md',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
};

