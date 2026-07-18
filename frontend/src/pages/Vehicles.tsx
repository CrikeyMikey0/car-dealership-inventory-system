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
import { formatCurrency } from '../utils/format';

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

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (quantity <= 3) return <Badge variant="warning">Low Stock ({quantity})</Badge>;
    return <Badge variant="success">In Stock ({quantity})</Badge>;
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Vehicle Inventory</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 transition-colors">
              Browse and filter available vehicles in our dealership
            </p>
          </div>
          {user?.role === 'ADMIN' && (
            <Link to="/vehicles/new">
              <Button variant="primary" size="md">
                + Add New Vehicle
              </Button>
            </Link>
          )}
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
                <div
                  key={vehicle.id}
                  className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    {vehicle.imageUrl ? (
                      <img 
                        src={vehicle.imageUrl} 
                        alt={`${vehicle.make} ${vehicle.model}`} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 ${vehicle.imageUrl ? 'hidden' : ''}`}>
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">{vehicle.make} {vehicle.model}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={vehicle.category.toLowerCase() === 'electric' ? 'indigo' : 'slate'}>
                          {vehicle.category}
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{vehicle.year}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {vehicle.make} {vehicle.model}
                      </h3>

                      <p className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
                        {formatCurrency(Number(vehicle.price))}
                      </p>

                      <div>{getStockBadge(vehicle.quantity)}</div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
                      <Link to={`/vehicles/${vehicle.id}`} className="w-full">
                        <Button variant="outline" size="sm" fullWidth className="rounded-full">
                          View Specs
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
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
