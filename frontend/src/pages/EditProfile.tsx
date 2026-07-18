import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MainLayout } from '../layouts/MainLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { notify } from '../utils/notification';

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const EditProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const handleProfileSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      updateUser({ name: data.name, email: data.email });
      notify.success('Profile updated successfully!');
      navigate('/profile');
    } catch (err: any) {
      notify.error('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <Link to="/profile" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 transition-colors">Edit Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            Update your account name and contact email address
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl transition-colors">
          <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-6" noValidate>
            <Input
              label="Full Name"
              type="text"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Link to="/profile">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProfile;
