import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';
import { vehicleService } from '../services/vehicle.service';
import { Vehicle } from '../types';
import { getGreeting } from '../utils/greeting';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await vehicleService.getVehicles({ limit: 100 });
        setVehicles(response.data);
        setTotalVehicles(response.total);
      } catch (err) {
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const totalStockCount = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const lowStockCount = vehicles.filter((v) => v.quantity <= 3).length;
  const electricCount = vehicles.filter((v) => v.category.toLowerCase() === 'electric').length;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-900/60 dark:via-slate-900 dark:to-purple-900/40 border border-indigo-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={user?.role === 'ADMIN' ? 'indigo' : 'slate'}>
                {user?.role === 'ADMIN' ? 'Administrator' : 'Employee / Customer'}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              {getGreeting(user?.name || 'User')} 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm transition-colors">
              Logged in as <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.email}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/profile">
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/vehicles/new">
                <Button variant="primary" size="sm">
                  + Add New Vehicle
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Inventory Statistics Overview */}
        {user?.role === 'ADMIN' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Inventory Statistics Overview</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 transition-colors">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Total Models</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalVehicles}</p>
                <p className="text-xs text-slate-600 dark:text-slate-500">Unique vehicle configurations</p>
              </div>

              <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 transition-colors">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Total Stock Units</p>
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{totalStockCount}</p>
                <p className="text-xs text-slate-600 dark:text-slate-500">Vehicles currently in showroom</p>
              </div>

              <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 transition-colors">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Low Stock Warnings</p>
                <p className="text-3xl font-extrabold text-amber-500 dark:text-amber-400">{lowStockCount}</p>
                <p className="text-xs text-slate-600 dark:text-slate-500">Vehicles with 3 or fewer units</p>
              </div>

              <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-2 transition-colors">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Electric Vehicles</p>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{electricCount}</p>
                <p className="text-xs text-slate-600 dark:text-slate-500">Zero-emission models</p>
              </div>
            </div>
          )}
        </div>
        )}

        {/* User Specific Content */}
        {user?.role === 'USER' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Recent Activity</h2>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center transition-colors">
              <p className="text-slate-500 dark:text-slate-400">No recent purchases or viewed vehicles found.</p>
              <Link to="/vehicles">
                <Button variant="outline" className="mt-4">
                  Browse Inventory
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Action Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/vehicles"
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group"
            >
              <div className="text-3xl mb-3">🚘</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Browse Inventory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                View, search, and filter all dealership vehicles in real-time.
              </p>
            </Link>

            <Link
              to="/profile"
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group"
            >
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Manage Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                View your user role, profile information, and edit profile settings.
              </p>
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                to="/vehicles/new"
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group"
              >
                <div className="text-3xl mb-3">➕</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Add New Vehicle
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Create and publish a new vehicle listing to the dealership inventory.
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
