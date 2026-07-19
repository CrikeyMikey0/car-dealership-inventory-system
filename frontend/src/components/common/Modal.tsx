/**
 * @file Modal.tsx
 * @description Accessible, animated overlay modal dialog component.
 *
 * Renders a full-screen backdrop with a centred content card.  The modal
 * includes a title header with an accessible close button.
 *
 * The component returns `null` when `isOpen` is `false` so it leaves no
 * DOM footprint when closed.
 *
 * @example
 * <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Delete">
 *   <p>Are you sure you want to delete this vehicle?</p>
 * </Modal>
 */

import React from 'react';

/**
 * Props for the `Modal` component.
 */
export interface ModalProps {
  /** Controls whether the modal is visible. */
  isOpen: boolean;
  /** Callback invoked when the user clicks the close (×) button. */
  onClose: () => void;
  /** Text displayed in the modal header. */
  title: string;
  /** Content rendered in the modal body. */
  children: React.ReactNode;
}

/**
 * Overlay modal dialog component.
 *
 * Renders nothing when `isOpen` is `false`.  When open, it covers the
 * entire viewport with a blurred backdrop and displays a centred card
 * with a header and a scrollable body slot.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Return null when closed — no DOM node, no layout impact
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-colors">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">{title}</h3>
          <button
            onClick={onClose}
            aria-label="close"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body — scrollable to handle tall content */}
        <div className="px-6 py-4 flex-1 text-slate-600 dark:text-slate-300 overflow-y-auto transition-colors">{children}</div>
      </div>
    </div>
  );
};
