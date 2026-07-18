import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MainLayout } from '../layouts/MainLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { notify } from '../utils/notification';
import apiClient from '../api/apiClient';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      setIsSubmitting(true);
      setGlobalError(null);
      await apiClient.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      notify.success('Password changed successfully');
      navigate('/profile');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to change password. Please try again.';
      setGlobalError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Change Password</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update your account security credentials</p>
          </div>
          
          <div className="p-8">
            {globalError && <ErrorMessage message={globalError} className="mb-6" />}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                {...register('currentPassword')}
                error={errors.currentPassword?.message}
              />
              
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              
              <div className="pt-4 flex gap-4">
                <Link to="/profile" className="flex-1">
                  <Button variant="outline" type="button" className="w-full" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>
                <Button variant="primary" type="submit" className="flex-1" isLoading={isSubmitting}>
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
