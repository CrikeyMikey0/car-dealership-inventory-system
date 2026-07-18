import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginForm } from '../components/forms/LoginForm';
import { authService } from '../services/auth.service';
import { useAuth } from '../hooks/useAuth';
import { notify } from '../utils/notification';
import { LoginPayload } from '../types';

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (data: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      login(
        { accessToken: response.accessToken, refreshToken: response.refreshToken },
        response.user
      );
      notify.success(`Welcome back, ${response.user.name || 'User'}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      notify.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In to AutoDrive" subtitle="Enter your credentials to access your dealership account">
      <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
      <div className="mt-6 text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
          Create one now
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
