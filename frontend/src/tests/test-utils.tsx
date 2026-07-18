import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
