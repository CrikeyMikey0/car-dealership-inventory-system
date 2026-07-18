import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Spinner } from '../components/common/Spinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { vehicleService } from '../services/vehicle.service';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/format';
import { notify } from '../utils/notification';
import { Vehicle } from '../types';

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Purchase Modal state
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1);
  const [isSubmittingPurchase, setIsSubmittingPurchase] = useState<boolean>(false);

  // Restock Modal state (Admin)
  const [isRestockModalOpen, setIsRestockModalOpen] = useState<boolean>(false);
  const [restockQuantity, setRestockQuantity] = useState<number>(5);
  const [isSubmittingRestock, setIsSubmittingRestock] = useState<boolean>(false);

  // Delete Confirmation Modal state (Admin)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState<boolean>(false);

  const fetchVehicleDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehicleById(id);
      setVehicle(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicle details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !vehicle) return;
    setIsSubmittingPurchase(true);
    try {
      const updated = await vehicleService.purchaseVehicle(id, purchaseQuantity);
      setVehicle(updated);
      notify.success(`Successfully purchased ${purchaseQuantity} unit(s) of ${vehicle.make} ${vehicle.model}!`);
      setIsPurchaseModalOpen(false);
    } catch (err: any) {
      notify.error(err.response?.data?.message || 'Purchase failed.');
    } finally {
      setIsSubmittingPurchase(false);
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !vehicle) return;
    setIsSubmittingRestock(true);
    try {
      const updated = await vehicleService.restockVehicle(id, restockQuantity);
      setVehicle(updated);
      notify.success(`Restocked ${restockQuantity} units for ${vehicle.make} ${vehicle.model}!`);
      setIsRestockModalOpen(false);
    } catch (err: any) {
      notify.error(err.response?.data?.message || 'Restock failed.');
    } finally {
      setIsSubmittingRestock(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!id) return;
    setIsSubmittingDelete(true);
    try {
      await vehicleService.deleteVehicle(id);
      notify.success('Vehicle deleted successfully.');
      navigate('/vehicles');
    } catch (err: any) {
      notify.error(err.response?.data?.message || 'Failed to delete vehicle.');
      setIsSubmittingDelete(false);
    }
  };

  return (
    <MainLayout>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="max-w-xl mx-auto py-12">
          <ErrorMessage message={error} />
          <div className="mt-4 text-center">
            <Link to="/vehicles">
              <Button variant="outline">Back to Inventory</Button>
            </Link>
          </div>
        </div>
      ) : vehicle ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Back Navigation & Admin Quick Actions */}
          <div className="flex items-center justify-between">
            <Link to="/vehicles" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              ← Back to All Vehicles
            </Link>
            {user?.role === 'ADMIN' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsRestockModalOpen(true)}>
                  Restock Inventory
                </Button>
                <Link to={`/vehicles/${vehicle.id}/edit`}>
                  <Button variant="primary" size="sm">
                    Edit Vehicle
                  </Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Vehicle Spec Card */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-colors">
            {/* Image Banner */}
            <div className="h-64 sm:h-96 w-full bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center overflow-hidden">
              {vehicle.imageUrl ? (
                <img 
                  src={vehicle.imageUrl} 
                  alt={`${vehicle.make} ${vehicle.model}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 ${vehicle.imageUrl ? 'hidden' : ''}`}>
                <svg className="w-16 h-16 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">No Image Available</span>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="indigo">{vehicle.category}</Badge>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{vehicle.year}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Listing Price</p>
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(Number(vehicle.price))}
                  </p>
                </div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/60">
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Make</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{vehicle.make}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Model</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Year</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{vehicle.year}</p>
                </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Stock Availability</p>
                <div className="mt-1">
                  {vehicle.quantity > 0 ? (
                    <Badge variant="success">{vehicle.quantity} Available</Badge>
                  ) : (
                    <Badge variant="danger">Out of Stock</Badge>
                  )}
                </div>
              </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Vehicle ID: <code className="text-xs text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded-md">{vehicle.id}</code>
                </div>

                {isAuthenticated ? (
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={vehicle.quantity === 0}
                    onClick={() => setIsPurchaseModalOpen(true)}
                  >
                    {vehicle.quantity > 0 ? 'Purchase Vehicle' : 'Out of Stock'}
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="primary" size="lg">
                      Sign in to Purchase
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Purchase Modal */}
          <Modal
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            title="Confirm Purchase"
          >
            <form onSubmit={handlePurchaseSubmit} className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 mb-6">
                You are purchasing <strong>{vehicle.make} {vehicle.model}</strong> at {formatCurrency(Number(vehicle.price))} per unit.
              </p>
              <Input
                label="Quantity"
                type="number"
                min={1}
                max={vehicle.quantity}
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(Math.max(1, Math.min(vehicle.quantity, Number(e.target.value))))}
              />
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Unit Price:</span>
                  <span>{formatCurrency(Number(vehicle.price))}</span>
                </div>
                <div className="flex justify-between text-slate-100 font-bold text-base pt-2 border-t border-slate-800">
                  <span>Total Amount:</span>
                  <span className="text-emerald-400">{formatCurrency(Number(vehicle.price) * purchaseQuantity)}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={() => setIsPurchaseModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" isLoading={isSubmittingPurchase}>
                  Confirm Purchase
                </Button>
              </div>
            </form>
          </Modal>

          {/* Restock Modal (Admin) */}
          <Modal
            isOpen={isRestockModalOpen}
            onClose={() => setIsRestockModalOpen(false)}
            title="Restock Inventory"
          >
            <form onSubmit={handleRestockSubmit} className="space-y-6">
              <p className="text-slate-300 text-sm">
                Add additional stock units for <strong>{vehicle.make} {vehicle.model}</strong>. Current stock: {vehicle.quantity}.
              </p>
              <Input
                label="Restock Quantity"
                type="number"
                min={1}
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Math.max(1, Number(e.target.value)))}
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={() => setIsRestockModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" isLoading={isSubmittingRestock}>
                  Restock
                </Button>
              </div>
            </form>
          </Modal>

          {/* Delete Confirmation Modal (Admin) */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title="Delete Vehicle Listing"
          >
            <div className="space-y-6">
              <p className="text-slate-300 text-sm">
                Are you sure you want to permanently delete <strong>{vehicle.make} {vehicle.model}</strong> ({vehicle.id})? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" type="button" isLoading={isSubmittingDelete} onClick={handleDeleteSubmit}>
                  Confirm Delete
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      ) : null}
    </MainLayout>
  );
};

export default VehicleDetails;
