/**
 * @file App.tsx
 * @description Root application component.
 *
 * Composes the global provider tree and renders the application router.
 * Provider order is important:
 *  1. `BrowserRouter`  — provides routing context to all descendants.
 *  2. `ThemeProvider`  — manages dark/light theme state (must wrap `AuthProvider`
 *                        so `ThemedToaster` can read the current theme).
 *  3. `AuthProvider`   — manages authentication state and provides user context.
 *  4. `CursorGlow`     — decorative cursor effect overlay (rendered outside the
 *                        router tree so it covers the whole viewport).
 *  5. `AppRouter`      — declares all application routes.
 *  6. `ThemedToaster`  — global toast notification container.
 */

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import { AppRouter } from './routes/AppRouter';
import { CursorGlow } from './components/common/CursorGlow';

/**
 * Inner component that reads the current theme from `ThemeContext` and
 * passes it to the `Toaster` so toast messages match the active colour scheme.
 *
 * Must be rendered inside `ThemeProvider` — extracted into its own component
 * because hooks cannot be called inside the root `App` function before the
 * provider tree is established.
 */
const ThemedToaster = () => {
  const { theme } = useTheme();
  return <Toaster position="top-right" richColors closeButton theme={theme} />;
};

/**
 * Root application component.
 *
 * Renders the global provider tree and delegates routing to `AppRouter`.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {/* Decorative cursor glow effect overlay */}
          <CursorGlow />
          {/* All application routes */}
          <AppRouter />
          {/* Toast notifications rendered at the top-right of the viewport */}
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
