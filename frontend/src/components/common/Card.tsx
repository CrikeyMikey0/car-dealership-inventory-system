import React from 'react';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg ${className}`}>
      {title && <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  );
};
