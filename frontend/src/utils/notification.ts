/**
 * @file utils/notification.ts
 * @description Centralised toast notification helpers.
 *
 * Wraps the `sonner` `toast` function behind a consistent `notify` API
 * so components don't import `toast` directly.  This makes it trivial
 * to swap the notification library in the future without touching every
 * callsite.
 *
 * @example
 * notify.success('Vehicle created successfully!');
 * notify.error('Something went wrong.');
 */

import { toast } from 'sonner';

/**
 * Grouped toast notification helpers.
 * Each method maps to the corresponding `sonner` toast variant.
 */
export const notify = {
  /**
   * Displays a success (green) toast notification.
   * @param message - The message to display.
   */
  success: (message: string) => {
    toast.success(message);
  },

  /**
   * Displays an error (red) toast notification.
   * @param message - The message to display.
   */
  error: (message: string) => {
    toast.error(message);
  },

  /**
   * Displays a warning (yellow) toast notification.
   * @param message - The message to display.
   */
  warning: (message: string) => {
    toast.warning(message);
  },

  /**
   * Displays an informational (blue) toast notification.
   * @param message - The message to display.
   */
  info: (message: string) => {
    toast.info(message);
  },
};
