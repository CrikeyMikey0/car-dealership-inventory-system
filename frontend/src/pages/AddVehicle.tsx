/**
 * @file AddVehicle.tsx
 * @description Page for adding a new vehicle to the inventory.
 *
 * Provides a form interface for ADMIN users to create a new vehicle record.
 * Uses the reusable `VehicleForm` component and submits data via the
 * `vehicleService`.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { VehicleForm } from '../components/forms/VehicleForm';
import { vehicleService } from '../services/vehicle.service';
import { notify } from '../utils/notification';
import { CreateVehiclePayload } from '../types';

export const AddVehicle: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSubmit = async (data: CreateVehiclePayload) => {
    setIsLoading(true);
    try {
      await vehicleService.createVehicle(data);
      notify.success(`Successfully added ${data.make} ${data.model} to inventory!`);
      navigate('/vehicles');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to add vehicle.';
      notify.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link to="/vehicles" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Back to Inventory
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 transition-colors">Add New Vehicle</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            Create a new vehicle listing in the dealership database
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl transition-colors">
          <VehicleForm onSubmit={handleCreateSubmit} isLoading={isLoading} submitButtonText="Add Vehicle" />
        </div>
      </div>
    </MainLayout>
  );
};

export default AddVehicle;
