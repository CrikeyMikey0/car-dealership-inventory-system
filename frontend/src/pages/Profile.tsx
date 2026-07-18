import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">User Profile</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 transition-colors">
            Manage your personal profile and account credentials
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6 transition-colors">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{user?.name || 'User Name'}</h2>
              <div className="mt-1">
                <Badge variant={user?.role === 'ADMIN' ? 'indigo' : 'slate'}>
                  {user?.role === 'ADMIN' ? 'Administrator' : 'Standard User'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Full Name</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{user?.name || 'Not provided'}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Email Address</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{user?.email}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Account Role</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">{user?.role}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Joined Date</span>
              <span className="text-slate-900 dark:text-slate-100 font-semibold">
                {user?.createdAt ? new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(user.createdAt)) : 'N/A'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">User Identifier</span>
              <code className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded">{user?.id}</code>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-4">
              <Link to="/profile/edit">
                <Button variant="primary" size="md">
                  Edit Profile
                </Button>
              </Link>
              <Link to="/profile/change-password">
                <Button variant="outline" size="md">
                  Change Password
                </Button>
              </Link>
            </div>

            <Button variant="danger" size="md" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
