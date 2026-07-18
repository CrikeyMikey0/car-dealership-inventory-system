import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import { AppRouter } from './routes/AppRouter';
import { CursorGlow } from './components/common/CursorGlow';

const ThemedToaster = () => {
  const { theme } = useTheme();
  return <Toaster position="top-right" richColors closeButton theme={theme} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CursorGlow />
          <AppRouter />
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
