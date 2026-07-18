import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';
import { vehicleService } from '../services/vehicle.service';
import { useAuth } from '../hooks/useAuth';
import { Vehicle, PaginatedVehicles } from '../types';
import { VehicleCard } from '../components/vehicles/VehicleCard';

export const Vehicles: React.FC = () => {
  const { user } = useAuth();
  const [vehiclesData, setVehiclesData] = useState<PaginatedVehicles | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'make' | 'model' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const fetchVehiclesList = async () => {
    setIsLoading(true);
    try {
      const response = await vehicleService.getVehicles({
        page,
        limit: 8,
        make: searchKeyword.trim() ? searchKeyword.trim() : undefined,
        category: categoryFilter ? categoryFilter : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy,
        sortOrder,
      });
      setVehiclesData(response);
    } catch (err) {
      setVehiclesData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesList();
  }, [page, categoryFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchVehiclesList();
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setCategoryFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Premium Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12 mb-8 shadow-xl flex flex-col items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1600")' }}>
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm pointer-events-none"></div>
          <div className="relative z-10 space-y-3">
            <Badge variant="indigo" className="mb-2">Our Collection</Badge>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">Vehicle Inventory</h1>
            <p className="text-slate-200 text-lg max-w-2xl mx-auto font-medium">
              Browse and filter available vehicles in our premium dealership collection. Find your next journey with us.
            </p>
            {user?.role === 'ADMIN' && (
              <div className="pt-4">
                <Link to="/vehicles/new">
                  <Button variant="primary" size="lg" className="shadow-lg hover:scale-105 transition-transform">
                    + Add New Vehicle
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search & Filters Bar */}
        <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Search Make / Keyword"
              placeholder="Search by make, model, or category..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />

            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              options={[
                { label: 'All Categories', value: '' },
                { label: 'Electric', value: 'Electric' },
                { label: 'SUV', value: 'SUV' },
                { label: 'Truck', value: 'Truck' },
                { label: 'Sedan', value: 'Sedan' },
                { label: 'Coupe', value: 'Coupe' },
              ]}
            />

            <Input
              label="Min Price (₹)"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <Input
              label="Max Price (₹)"
              type="number"
              placeholder="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-3">
              <Select
                label=""
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                options={[
                  { label: 'Sort by Date', value: 'createdAt' },
                  { label: 'Sort by Price', value: 'price' },
                  { label: 'Sort by Make', value: 'make' },
                  { label: 'Sort by Model', value: 'model' },
                ]}
              />

              <Select
                label=""
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                options={[
                  { label: 'Descending', value: 'desc' },
                  { label: 'Ascending', value: 'asc' },
                ]}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="primary" size="sm">
                Apply Search
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </form>

        {/* Vehicles Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : vehiclesData && vehiclesData.data.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehiclesData.data.map((vehicle: Vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            <Pagination
              currentPage={vehiclesData.page}
              totalPages={vehiclesData.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        ) : (
          <EmptyState
            title="No vehicles found"
            message="No vehicles matched your search or filter criteria. Try clearing your filters."
            actionText="Clear All Filters"
            onAction={clearFilters}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Vehicles;
