/**
 * @file Home.tsx
 * @description Public landing page for the application.
 *
 * Features a hero section with a search bar, a "Featured Vehicles" grid
 * displaying the 3 most recently added vehicles, and promotional call-outs.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { vehicleService } from '../services/vehicle.service';
import { Vehicle } from '../types';
import { Spinner } from '../components/common/Spinner';
import { formatCurrency } from '../utils/format';
import { useAuth } from '../hooks/useAuth';
import { getGreeting } from '../utils/greeting';

const getCategoryVariant = (category: string) => {
  const cat = category.toLowerCase();
  switch (cat) {
    case 'electric': return 'indigo';
    case 'suv': return 'purple';
    case 'truck': return 'warning';
    case 'coupe': return 'pink';
    case 'sedan': return 'primary';
    default: return 'secondary';
  }
};

const getCategoryHoverColor = (category: string) => {
  const cat = category.toLowerCase();
  switch (cat) {
    case 'electric': return 'hover:border-indigo-300 dark:hover:border-indigo-500/50';
    case 'suv': return 'hover:border-purple-300 dark:hover:border-purple-500/50';
    case 'truck': return 'hover:border-amber-300 dark:hover:border-amber-500/50';
    case 'coupe': return 'hover:border-pink-300 dark:hover:border-pink-500/50';
    case 'sedan': return 'hover:border-emerald-300 dark:hover:border-emerald-500/50';
    default: return 'hover:border-slate-300 dark:hover:border-slate-500/50';
  }
};

const getStockVariant = (quantity: number): 'stock-low' | 'stock-medium' | 'stock-high' => {
  if (quantity <= 3) return 'stock-low';
  if (quantity <= 7) return 'stock-medium';
  return 'stock-high';
};

/**
 * Public landing page for the application.
 *
 * This component is responsible for rendering the main entry point of the dealership site.
 * It integrates with the `useAuth` hook to display personalized greetings for logged-in users,
 * and fetches the latest added vehicles to display in the "Featured Vehicles" section.
 *
 * @returns {React.FC} The fully constructed Home page wrapped in `MainLayout`.
 */
export const Home: React.FC = () => {
  // Retrieve authentication state to conditionally render greeting and CTA buttons
  const { user, isAuthenticated } = useAuth();

  // State to hold the top 4 most recently added vehicles for the featured section
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);

  // Tracks the loading state of the initial vehicle fetch to show a spinner
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Effect hook to fetch featured vehicles on component mount.
   * We request the 4 most recent vehicles by sorting on `createdAt` descending.
   */
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await vehicleService.getVehicles({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' });
        setFeaturedVehicles(response.data);
      } catch (err) {
        // Fallback to empty array if API fails, avoiding UI crashes
        setFeaturedVehicles([]);
      } finally {
        // Ensure loading state is disabled regardless of success or failure
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section
        className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pt-8 pb-16 md:pb-24 px-6 sm:px-12 md:px-16 mb-16 md:mb-24 shadow-xl transition-colors duration-300 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000")' }}
      >
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/80 backdrop-blur-sm pointer-events-none transition-colors duration-300"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-transparent to-purple-500/20 pointer-events-none transition-colors duration-300"></div>
        <div className="relative max-w-4xl space-y-6 z-10 text-center flex flex-col items-center">
          {isAuthenticated && (
            <Badge variant="success" className="animate-fade-in-up mb-2 block w-fit" size="lg">
              {getGreeting(user?.name || 'User')} 👋
            </Badge>
          )}
          <Badge variant="indigo" className="animate-fade-in-up" size="lg">Premier Dealership Experience</Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-300 drop-shadow-sm">
            Find Your Dream Vehicle with <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">KATA</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed transition-colors duration-300 font-medium max-w-2xl">
            Browse our curated inventory of premium electric, SUV, truck, coupe, and sedan vehicles. Real-time availability, instant online purchase, and full dealership transparency.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <Link to="/vehicles">
              <Button variant="primary" size="lg" className="shadow-lg shadow-indigo-500/30 hover:scale-110 transition-transform">
                Explore Inventory →
              </Button>
            </Link>
            {!isAuthenticated && (
              <Link to="/register">
                <Button variant="secondary" size="lg" className="hover:scale-110 shadow-grey-500/30 transition-transform bg-white-900/50 dark:bg-slate-800/50 backdrop-blur-md border-slate-300 dark:border-slate-700">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">100%</p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Verified Inventory</p>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400">24/7</p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Live Stock Tracking</p>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">Instant</p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Online Purchase</p>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
          <p className="text-3xl font-black text-amber-500 dark:text-amber-400">5-Star</p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Customer Service</p>
        </div>
      </section>

      {/* Featured Vehicles Section (Carousel) */}
      <section className="mb-24 space-y-0 relative">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Featured Vehicles</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base transition-colors max-w-xl mx-auto">Explore top models available in our showroom today</p>
          <div className="pt-2">
            <Link to="/vehicles" className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">
              View All Inventory →
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map((vehicle) => (
              <div key={vehicle.id} className={`bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden ${getCategoryHoverColor(vehicle.category)} transition-all group flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-1`}>
                {/* Image Area */}
                <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={getCategoryVariant(vehicle.category)} size='md'>
                        {vehicle.category}
                      </Badge>
                      <span className="text-xs font-bold tracking-wider text-slate-400">{vehicle.year}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(Number(vehicle.price))}
                    </p>
                  </div>
                  <div className="pt-5 mt-4 border-t border-indigo-400 dark:border-indigo-500  transition-colors duration-300 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 relative">
                    <Badge variant={getStockVariant(vehicle.quantity)} size='md'>{vehicle.quantity} Items left</Badge>
                    <Link to={`/vehicles/${vehicle.id}`}>
                      <Button variant="outline" size="lg" className="rounded-full px-9 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 shadow-sm transition-colors duration-300">
            No featured vehicles available right now. Check back soon!
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-indigo-600 dark:bg-indigo-900 rounded-3xl p-8 sm:p-16 space-y-6 shadow-xl transition-colors duration-300 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">About KATA</h2>
          <p className="text-indigo-100 leading-relaxed max-w-4xl mx-auto text-lg sm:text-xl font-medium">
            KATA is an enterprise-grade car dealership inventory platform designed to deliver seamless car buying and dealership management experiences. With automated stock updates, multi-filter search, role-based controls for employees and administrators, and instantaneous checkout options, we redefine modern auto sales.
          </p>
          <div className="pt-4">
            <Link to="/about">
              <Button variant="outline" size="lg" className="bg-white hover:bg-indigo-50 !text-indigo-900 dark:!text-indigo-900 border-none shadow-md rounded-full px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
