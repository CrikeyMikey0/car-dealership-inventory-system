/**
 * @file VehicleForm.tsx
 * @description Form component for creating or updating a vehicle record.
 *
 * Provides a comprehensive form with fields for make, model, year, category,
 * price, quantity, and an optional image URL. Includes a real-time image
 * preview. Shared by both the AddVehicle and EditVehicle pages.
 */

import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { CreateVehiclePayload } from '../../types';

const vehicleSchema = z.object({
  make: z.string().trim().min(1, 'Make is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.coerce.number().int().min(1886, 'Year must be 1886 or newer').max(new Date().getFullYear() + 2, 'Invalid model year'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  imageUrl: z.string().url('Must be a valid URL').min(1, 'Image URL is required'),
});

interface VehicleFormProps {
  initialValues?: Partial<CreateVehiclePayload>;
  onSubmit: (data: CreateVehiclePayload) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Save Vehicle',
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateVehiclePayload>({
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues: {
      make: initialValues?.make || '',
      model: initialValues?.model || '',
      year: initialValues?.year || new Date().getFullYear(),
      category: initialValues?.category || 'Sedan',
      price: initialValues?.price || 0,
      quantity: initialValues?.quantity || 1,
      imageUrl: initialValues?.imageUrl || '',
    },
  });

  const [imageValid, setImageValid] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const imageUrlValue = useWatch({ control, name: 'imageUrl' as any }) as string | undefined;

  useEffect(() => {
    if (!imageUrlValue) {
      setImageValid(null);
      return;
    }

    const timer = setTimeout(() => {
      setIsVerifying(true);
      const img = new Image();
      img.onload = () => {
        setImageValid(true);
        setIsVerifying(false);
      };
      img.onerror = () => {
        setImageValid(false);
        setIsVerifying(false);
      };
      img.src = imageUrlValue;
    }, 500);

    return () => clearTimeout(timer);
  }, [imageUrlValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Make"
          placeholder="e.g. Tesla"
          error={errors.make?.message}
          {...register('make')}
        />

        <Input
          label="Model"
          placeholder="e.g. Model 3"
          error={errors.model?.message}
          {...register('model')}
        />

        <Input
          label="Model Year"
          type="number"
          placeholder="2023"
          error={errors.year?.message}
          {...register('year')}
        />

        <Select
          label="Category"
          error={errors.category?.message}
          options={[
            { label: 'Electric', value: 'Electric' },
            { label: 'SUV', value: 'SUV' },
            { label: 'Truck', value: 'Truck' },
            { label: 'Sedan', value: 'Sedan' },
            { label: 'Coupe', value: 'Coupe' },
            { label: 'Hybrid', value: 'Hybrid' },
          ]}
          {...register('category')}
        />

        <Input
          label="Listing Price (₹)"
          type="number"
          step="0.01"
          placeholder="29990.00"
          error={errors.price?.message}
          {...register('price')}
        />

        <Input
          label="Stock Quantity"
          type="number"
          placeholder="5"
          error={errors.quantity?.message}
          {...register('quantity')}
        />

        <div className="sm:col-span-2 space-y-2">
          <Input
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            error={(errors as any).imageUrl?.message}
            {...register('imageUrl' as any)}
          />
          
          {imageUrlValue && (
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50 mt-2">
              <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                Image Verification: 
                {isVerifying ? (
                  <span className="text-indigo-500 animate-pulse">Verifying...</span>
                ) : imageValid === true ? (
                  <span className="text-emerald-500">Valid Image ✓</span>
                ) : imageValid === false ? (
                  <span className="text-rose-500">Invalid Image URL (Failed to load) ✗</span>
                ) : null}
              </p>
              {imageValid === true && (
                <div className="relative h-48 w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={imageUrlValue} alt="Vehicle Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} disabled={isLoading || (!!imageUrlValue && imageValid === false)}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
