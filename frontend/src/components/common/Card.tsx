/**
 * @file Card.tsx
 * @description Simple container card component for grouping related content.
 *
 * Renders a dark-themed, bordered, rounded container with an optional title.
 * Used throughout the dashboard for stats panels, info blocks, and form sections.
 *
 * @example
 * <Card title="Inventory Summary">
 *   <p>Total vehicles: 42</p>
 * </Card>
 */

import React from 'react';

/**
 * Props for the `Card` component.
 */
export interface CardProps {
  /** Optional heading displayed at the top of the card, separated by a bottom border. */
  title?: string;
  /** The content to render inside the card body. */
  children: React.ReactNode;
  /** Additional Tailwind class names to merge onto the card container. */
  className?: string;
}

/**
 * Container card component.
 *
 * Renders children inside a dark-themed box with rounded corners, a subtle
 * border, and a drop shadow.  An optional title is displayed as a section
 * heading at the top of the card.
 */
export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg ${className}`}>
      {/* Optional card title with a bottom border separator */}
      {title && <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  );
};
