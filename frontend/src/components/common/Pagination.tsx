/**
 * @file Pagination.tsx
 * @description Pagination control component for navigating multi-page lists.
 *
 * Renders a responsive pagination bar with:
 *  - Previous / Next buttons (disabled when at the first or last page).
 *  - A numbered page list with ellipsis for large page counts.
 *  - A compact mobile view with Previous / Next only.
 *
 * Returns `null` when `totalPages <= 1` so it is safe to always render
 * without conditional wrapping at the call site.
 *
 * @example
 * <Pagination
 *   currentPage={page}
 *   totalPages={totalPages}
 *   onPageChange={(p) => setPage(p)}
 *   isLoading={isFetching}
 * />
 */

import React from 'react';
import { Button } from './Button';

/**
 * Props for the `Pagination` component.
 */
interface PaginationProps {
  /** The currently active page number (1-indexed). */
  currentPage: number;
  /** The total number of pages in the result set. */
  totalPages: number;
  /** Callback invoked with the new page number when the user navigates. */
  onPageChange: (page: number) => void;
  /**
   * When `true`, all page buttons are disabled to prevent navigation
   * while a new page of data is loading.
   */
  isLoading?: boolean;
}

/**
 * Pagination control component.
 *
 * Shows a smart page number list: always includes the first and last page,
 * and pages within ±2 of the current page.  Gaps between visible page
 * numbers are indicated with an ellipsis (`...`).
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  // Nothing to render for single-page results
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-800/80 px-4 py-4 sm:px-6 mt-6">
      {/* ── Mobile view: simple Previous / Next buttons ─────────────────── */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
        >
          Next
        </Button>
      </div>

      {/* ── Desktop view: page counter + numbered list ───────────────────── */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Page <span className="font-semibold text-slate-100">{currentPage}</span> of{' '}
            <span className="font-semibold text-slate-100">{totalPages}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
          >
            ← Previous
          </Button>

          {/* Render page number buttons with ellipsis for large page counts.
              Show: first page, last page, current page ± 2, and "..." in gaps. */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
            .map((page, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && page - prev > 1;

              return (
                <React.Fragment key={page}>
                  {showEllipsis && <span className="text-slate-600 px-1">...</span>}
                  <button
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
