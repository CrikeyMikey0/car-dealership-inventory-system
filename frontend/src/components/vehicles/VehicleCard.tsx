import React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/format';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const getStockBadge = (quantity: number) => {
  if (quantity === 0) return <Badge variant="danger">Out of Stock</Badge>;
  if (quantity <= 3) return <Badge variant="warning">Low Stock ({quantity})</Badge>;
  return <Badge variant="success">In Stock ({quantity})</Badge>;
};

// Implement Memoization for Performance Optimization
export const VehicleCard: React.FC<VehicleCardProps> = React.memo(({ vehicle }) => {
  return (
    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-1">
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
  );
});
