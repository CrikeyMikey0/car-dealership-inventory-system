import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black tracking-tighter text-sm transition-transform duration-300 hover:scale-110 shadow-lg ${className}`}
    >
      KATA
    </div>
  );
};
