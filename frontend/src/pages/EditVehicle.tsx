import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { VehicleForm } from '../components/forms/VehicleForm';
import { Spinner } from '../components/common/Spinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { vehicleService } from '../services/vehicle.service';
import { notify } from '../utils/notification';
import { Vehicle, CreateVehiclePayload } from '../types';

export const EditVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
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
    fetchVehicle();
  }, [id]);

  const handleUpdateSubmit = async (data: CreateVehiclePayload) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await vehicleService.updateVehicle(id, data);
      notify.success(`Successfully updated ${data.make} ${data.model}!`);
      navigate(`/vehicles/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update vehicle.';
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link to={`/vehicles/${id || ''}`} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Cancel & Back to Details
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 transition-colors">Edit Vehicle Details</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
            Update pricing, specifications, or stock for vehicle listing {id}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : vehicle ? (
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl transition-colors">
            <VehicleForm
              initialValues={{
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                category: vehicle.category,
                price: Number(vehicle.price),
                quantity: vehicle.quantity,
                imageUrl: vehicle.imageUrl || '',
              }}
              onSubmit={handleUpdateSubmit}
              isLoading={isSubmitting}
              submitButtonText="Update Vehicle"
            />
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default EditVehicle;
