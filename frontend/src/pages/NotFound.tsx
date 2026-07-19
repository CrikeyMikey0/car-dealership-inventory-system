/**
 * @file NotFound.tsx
 * @description HTTP 404 Not Found error page.
 *
 * Catch-all route component displayed when a user navigates to a URL
 * that does not exist in the React Router configuration.
 */

import React from 'react';

export const NotFound: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">404 - Not Found</h1>
    </div>
  );
};
