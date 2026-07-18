import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notify } from '../notification.ts';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('notification utility wrapping Sonner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls toast.success with the message', () => {
    notify.success('Operation succeeded');
    expect(toast.success).toHaveBeenCalledWith('Operation succeeded');
  });

  it('calls toast.error with the message', () => {
    notify.error('Operation failed');
    expect(toast.error).toHaveBeenCalledWith('Operation failed');
  });

  it('calls toast.warning with the message', () => {
    notify.warning('Watch out');
    expect(toast.warning).toHaveBeenCalledWith('Watch out');
  });
});
