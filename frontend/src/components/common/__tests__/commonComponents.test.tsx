import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Spinner } from '../Spinner.tsx';
import { Input } from '../Input.tsx';
import { TextArea } from '../TextArea.tsx';
import { Select } from '../Select.tsx';
import { Card } from '../Card.tsx';
import { Badge } from '../Badge.tsx';
import { LoadingScreen } from '../LoadingScreen.tsx';
import { EmptyState } from '../EmptyState.tsx';
import { ErrorMessage } from '../ErrorMessage.tsx';
import { PageContainer } from '../PageContainer.tsx';

describe('Common UI Components', () => {
  it('Spinner renders correctly', () => {
    render(<Spinner />);
    expect(screen.getByTestId('spinner-element')).toBeInTheDocument();
  });

  it('Input renders with label and value', () => {
    render(<Input label="Username" placeholder="Enter username" defaultValue="test" />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('Input displays error message', () => {
    render(<Input label="Username" error="Username is required" />);
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
  });

  it('TextArea renders with label and error', () => {
    render(<TextArea label="Description" error="Too short" defaultValue="Hello" />);
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/too short/i)).toBeInTheDocument();
  });

  it('Select renders with options and default selection', () => {
    render(
      <Select label="Role" defaultValue="admin">
        <option value="admin">Admin</option>
        <option value="employee">Employee</option>
      </Select>
    );
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('admin');
  });

  it('Card renders children and optional title', () => {
    render(
      <Card title="Card Title">
        <div data-testid="card-child">Card content</div>
      </Card>
    );
    expect(screen.getByText(/card title/i)).toBeInTheDocument();
    expect(screen.getByTestId('card-child')).toBeInTheDocument();
  });

  it('Badge renders variants correctly', () => {
    render(<Badge variant="success">Active</Badge>);
    const badge = screen.getByText(/active/i);
    expect(badge).toBeInTheDocument();
  });

  it('LoadingScreen renders overlay', () => {
    render(<LoadingScreen message="Loading app..." />);
    expect(screen.getByText(/loading app.../i)).toBeInTheDocument();
  });

  it('EmptyState renders call to action and description', () => {
    render(<EmptyState title="No Vehicles" description="Add a new vehicle to get started" />);
    expect(screen.getByText(/no vehicles/i)).toBeInTheDocument();
    expect(screen.getByText(/add a new vehicle to get started/i)).toBeInTheDocument();
  });

  it('ErrorMessage renders alert message', () => {
    render(<ErrorMessage message="Fatal error" />);
    expect(screen.getByText(/fatal error/i)).toBeInTheDocument();
  });

  it('PageContainer renders with children', () => {
    render(
      <PageContainer>
        <div data-testid="page-child">Content</div>
      </PageContainer>
    );
    expect(screen.getByTestId('page-child')).toBeInTheDocument();
  });
});
