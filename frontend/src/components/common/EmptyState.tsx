/**
 * @file EmptyState.tsx
 * @description Empty state placeholder component shown when a list or page has no content.
 *
 * Displays a centred, bordered container with an icon, a title, an optional
 * description, and an optional call-to-action.  The action can be supplied
 * either as a pre-built React node (`action` prop) or as a text/callback
 * pair (`actionText` + `onAction`) that renders a default outline button.
 *
 * @example
 * <EmptyState
 *   title="No vehicles found"
 *   description="Try adjusting your search filters."
 *   actionText="Reset Filters"
 *   onAction={handleReset}
 * />
 */

import { Button } from './Button';

/**
 * Props for the `EmptyState` component.
 */
export interface EmptyStateProps {
  /** Bold heading text displayed prominently in the empty state. */
  title: string;
  /** Secondary text shown below the title (alias: `message`). */
  description?: string;
  /** Secondary text shown below the title (alias: `description`). Takes precedence if both provided. */
  message?: string;
  /**
   * A pre-built React node to render as the call-to-action.
   * Use this for custom buttons or links.  Overrides `actionText` / `onAction`.
   */
  action?: React.ReactNode;
  /**
   * Button label for the auto-rendered outline action button.
   * Requires `onAction` to be set.
   */
  actionText?: string;
  /** Click handler for the auto-rendered action button. */
  onAction?: () => void;
}

/**
 * Empty state placeholder component.
 *
 * Renders a magnifying glass icon, a title, an optional description, and an
 * optional action.  Designed to replace empty list views and no-result states.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, message, action, actionText, onAction }) => {
  // `message` is treated as a legacy alias for `description`
  const displayText = message || description || '';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-xl space-y-4 max-w-md mx-auto">
      {/* Magnifying glass icon — generic "nothing found" indicator */}
      <div className="text-4xl text-slate-500">🔍</div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {displayText && <p className="text-sm text-slate-400 leading-relaxed">{displayText}</p>}
      </div>
      {/* Call-to-action: prefer the custom `action` node, fall back to the auto-button */}
      {action ? (
        <div>{action}</div>
      ) : actionText && onAction ? (
        <div>
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
