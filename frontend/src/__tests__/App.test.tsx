import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Root Component', () => {
  it('renders successfully without crashing and displays Home Page by default', () => {
    render(<App />);
    expect(screen.getByText(/Home Page Placeholder/i)).toBeInTheDocument();
  });
});
