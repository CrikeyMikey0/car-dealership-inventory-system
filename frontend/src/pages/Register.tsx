/**
 * @file Register.tsx
 * @description User registration page.
 *
 * Wraps the `RegisterForm` component within the `AuthLayout`. Handles the
 * API call to create a new user account and redirects to the login page
 * upon success.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { RegisterForm } from '../components/forms/RegisterForm';
import { authService } from '../services/auth.service';
import { notify } from '../utils/notification';
import { RegisterPayload } from '../types';

export const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (data: RegisterPayload) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      notify.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      notify.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Your Account" subtitle="Join AutoDrive to manage or browse dealership vehicles">
      <RegisterForm onSubmit={handleRegisterSubmit} isLoading={isLoading} />
      <div className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
