import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from '../Form.tsx';
import { Input } from '../../common/Input.tsx';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

describe('Form Component Wrapper', () => {
  it('submits successfully when data is valid', async () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={schema} onSubmit={handleSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <Input label="Username" {...register('username')} error={errors.username?.message} />
            <button type="submit">Submit</button>
          </>
        )}
      </Form>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'john_doe' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ username: 'john_doe' });
    });
  });

  it('shows error messages and prevents submission when invalid', async () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={schema} onSubmit={handleSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <Input label="Username" {...register('username')} error={errors.username?.message} />
            <button type="submit">Submit</button>
          </>
        )}
      </Form>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'jo' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();
    });
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
