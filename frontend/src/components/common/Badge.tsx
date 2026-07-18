import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border';

  const variants = {
    primary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
    secondary: 'bg-slate-500/10 text-slate-400 border-slate-500/25',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
};
