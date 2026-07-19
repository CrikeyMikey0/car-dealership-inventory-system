/**
 * @file ComingSoon.tsx
 * @description Generic placeholder page for pages under construction.
 *
 * Renders a visually polished "Coming Soon" page with theme integration,
 * dynamic titles, and a quick redirect back to the home page.
 */

import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

/**
 * Props for the `ComingSoon` page component.
 */
interface ComingSoonProps {
  /** The title of the page being shown as coming soon. */
  title?: string;
}

/**
 * Generic placeholder page component.
 */

export const ComingSoon: React.FC<ComingSoonProps> = ({ title = "Coming Soon" }) => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-5xl mb-4 shadow-inner">
          🚧
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          We are working hard on bringing this page to life. Please check back later!
        </p>
        <div className="pt-8">
          <Link to="/">
            <Button variant="primary" size="lg" className="rounded-full shadow-lg hover:-translate-y-1 transition-transform">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};
