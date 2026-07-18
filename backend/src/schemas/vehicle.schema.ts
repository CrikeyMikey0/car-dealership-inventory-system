import { z } from 'zod';

export const createVehicleSchema = z.object({
  make: z.string().trim().min(1, 'Make is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.number().int().min(1886, 'Year must be 1886 or newer').max(new Date().getFullYear() + 2, 'Invalid model year'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const getVehiclesQuerySchema = z.object({
  page: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().int().min(1).default(1)
  ),
  limit: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().int().min(1).default(10)
  ),
  make: z.string().trim().optional(),
  model: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  maxPrice: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  minQuantity: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().int().min(0).optional()
  ),
  maxQuantity: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().int().min(0).optional()
  ),
  availability: z.preprocess(
    (val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    },
    z.boolean().optional()
  ),
  sortBy: z.enum(['price', 'make', 'model', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchVehiclesQuerySchema = z.object({
  make: z.string().trim().optional(),
  model: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  maxPrice: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  keyword: z.string().trim().optional(),
});

export const purchaseVehicleSchema = z.object({
  quantity: z.number().int().positive('Quantity must be greater than zero'),
});

export const restockVehicleSchema = z.object({
  quantity: z.number().int().positive('Restock quantity must be positive'),
});
