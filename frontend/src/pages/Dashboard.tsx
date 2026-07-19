/**
 * @file Dashboard.tsx
 * @description Main dashboard page for authenticated users.
 *
 * Provides an overview of the dealership's inventory status, including
 * quick stats (total vehicles, low stock items) and quick actions based
 * on the user's role (ADMIN vs USER).
 */

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
import { formatCurrency } from '../utils/format';

/**
 * Main dashboard view for authenticated users.
 *
 * This component acts as the control center. For `ADMIN` users, it fetches the full
 * inventory to calculate and display high-level statistics (total models, stock count,
 * low stock warnings, EV counts). For standard `USER`s, it displays recent activity
 * placeholders. It also renders quick action buttons based on permissions.
 *
 * @returns {React.FC} The Dashboard page wrapped in `MainLayout`.
 */
export const Dashboard: React.FC = () => {
  // Retrieve the authenticated user to determine role-based rendering (ADMIN vs USER)
  const { user } = useAuth();
  
  // State to hold all vehicles fetched for statistics calculation
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  // Total number of unique vehicle models returned by the API
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  
  // Tracks the initial loading state while fetching dashboard statistics
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Effect hook to fetch comprehensive inventory data on component mount.
   * We request a large limit (100) to ensure we can compute accurate summary statistics
   * for the admin view without implementing a dedicated stats API endpoint.
   */
  // State to hold recently viewed vehicles from local storage
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

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

    // Load recently viewed vehicles
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading recently viewed vehicles:', e);
    }
  }, []);

  // --- Computed Statistics (derived from the fetched vehicles array) ---
  
  // Sum of all individual vehicle quantities across all models
  const totalStockCount = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  
  // Number of unique models that have 3 or fewer units remaining in stock
  const lowStockCount = vehicles.filter((v) => v.quantity <= 3).length;
  
  // Number of electric vehicles currently in the inventory
  const electricCount = vehicles.filter((v) => v.category.toLowerCase() === 'electric').length;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-900/60 dark:via-slate-900 dark:to-purple-900/40 border border-indigo-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={user?.role === 'ADMIN' ? 'indigo' : 'slate'}>
                {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
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
              <Button variant="outline" size="lg">
                View Profile
              </Button>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/vehicles/new">
                <Button variant="primary" size="lg">
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

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Recent Activity</h2>
          {recentlyViewed.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {recentlyViewed.map((v) => (
                <Link to={`/vehicles/${v.id}`} key={v.id} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all p-4 flex flex-col space-y-3 group shadow-sm hover:shadow-md">
                  <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative">
                    <img src={v.imageUrl} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{v.make} {v.model}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{v.category} • {v.year}</p>
                    </div>
                    <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{formatCurrency(Number(v.price))}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center transition-colors">
              <p className="text-slate-500 dark:text-slate-400">No recently viewed vehicles found.</p>
              <Link to="/vehicles">
                <Button variant="outline" className="mt-4">
                  Browse Inventory
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Action Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Quick Actions</h2>
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${
            user?.role === 'ADMIN' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
          } gap-6`}>
            <Link
              to="/vehicles"
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group text-center flex flex-col items-center justify-center"
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
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group text-center flex flex-col items-center justify-center"
            >
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Manage Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                View your user role, profile information, and edit profile settings.
              </p>
            </Link>

            <Link
              to="/contact"
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group text-center flex flex-col items-center justify-center"
            >
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Contact Us
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Get in touch with KATA support or sales representatives.
              </p>
            </Link>

            <Link
              to="/about"
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group text-center flex flex-col items-center justify-center"
            >
              <div className="text-3xl mb-3">ℹ️</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                About Us
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Learn more about KATA values, story, and mission.
              </p>
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                to="/vehicles/new"
                className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group text-center flex flex-col items-center justify-center"
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
