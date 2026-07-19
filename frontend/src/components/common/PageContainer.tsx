/**
 * @file PageContainer.tsx
 * @description Responsive max-width wrapper for page content.
 *
 * Applies a centred, responsive max-width container with consistent horizontal
 * padding and vertical spacing.  Used to ensure page content never stretches
 * beyond 7xl on wide screens.
 *
 * @example
 * <PageContainer>
 *   <h1>Page Title</h1>
 *   <p>Content…</p>
 * </PageContainer>
 */

import React from 'react';


export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full ${className}`}>
      {children}
    </div>
  );
};
