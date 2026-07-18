import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  message?: string;
  action?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, message, action, actionText, onAction }) => {
  const displayText = message || description || '';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-xl space-y-4 max-w-md mx-auto">
      <div className="text-4xl text-slate-500">🔍</div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {displayText && <p className="text-sm text-slate-400 leading-relaxed">{displayText}</p>}
      </div>
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

