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

// Implement Memoization for Performance Optimization
export const VehicleCard: React.FC<VehicleCardProps> = React.memo(({ vehicle }) => {
  return (
    <div className={`bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden ${getCategoryHoverColor(vehicle.category)} transition-all group flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-1`}>
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
            <Badge variant={getCategoryVariant(vehicle.category)}>
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
