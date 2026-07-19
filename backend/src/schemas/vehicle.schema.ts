/**
 * @file vehicle.schema.ts
 * @description Zod validation schemas for vehicle-related request payloads and query strings.
 *
 * Schemas are consumed by the `validateBody` and `validateQuery` middleware.
 * Numeric query-string parameters (which are always raw strings from the HTTP
 * layer) are coerced to numbers via `z.preprocess`.  The availability flag is
 * coerced from the string literals `"true"` / `"false"` to JavaScript booleans.
 */

import { z } from 'zod';

/**
 * Schema for POST /api/vehicles request body (create a new vehicle).
 *
 * Rules:
 *  - `make`      — required, trimmed, non-empty.
 *  - `model`     — required, trimmed, non-empty.
 *  - `year`      — integer, must be between 1886 (first car) and 2 years from now.
 *  - `category`  — required, trimmed, non-empty (e.g. "Sedan", "SUV").
 *  - `price`     — number, cannot be negative.
 *  - `quantity`  — integer, cannot be negative.
 *  - `imageUrl`  — required, must be a valid URL.
 */
export const createVehicleSchema = z.object({
  make: z.string().trim().min(1, 'Make is required'),
  model: z.string().trim().min(1, 'Model is required'),
  year: z.number().int().min(1886, 'Year must be 1886 or newer').max(new Date().getFullYear() + 2, 'Invalid model year'),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  imageUrl: z.string().trim().url('Invalid image URL').min(1, 'Image URL is required'),
});

/**
 * Schema for PUT /api/vehicles/:id request body (update an existing vehicle).
 *
 * All fields from `createVehicleSchema` are optional — callers only need to
 * supply the fields they want to change.
 */
export const updateVehicleSchema = createVehicleSchema.partial();

/**
 * Schema for GET /api/vehicles query parameters (list with filtering and pagination).
 *
 * All parameters are optional.  String query parameters that represent numbers
 * (e.g. `?page=2&limit=20`) are preprocessed and coerced to JS numbers before
 * Zod validates them.
 *
 * Fields:
 *  - `page`         — page number (default: 1).
 *  - `limit`        — items per page (default: 10).
 *  - `make`         — filter by exact make (case-insensitive).
 *  - `model`        — filter by exact model (case-insensitive).
 *  - `category`     — filter by exact category (case-insensitive).
 *  - `minPrice`     — lower bound for the price range.
 *  - `maxPrice`     — upper bound for the price range.
 *  - `minQuantity`  — lower bound for the quantity range.
 *  - `maxQuantity`  — upper bound for the quantity range.
 *  - `availability` — `true` = in stock (quantity > 0); `false` = out of stock.
 *  - `sortBy`       — field to sort by (default: "createdAt").
 *  - `sortOrder`    — sort direction (default: "desc").
 */
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
      // Convert query string literals to boolean; undefined passes through
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    },
    z.boolean().optional()
  ),
  sortBy: z.enum(['price', 'make', 'model', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Schema for GET /api/vehicles/search query parameters (keyword/filter search).
 *
 * Simpler than `getVehiclesQuerySchema` — no pagination, just filters and
 * an optional free-text `keyword` that matches across make, model, and category.
 *
 * Fields:
 *  - `make`      — filter by exact make (case-insensitive).
 *  - `model`     — filter by exact model (case-insensitive).
 *  - `category`  — filter by exact category (case-insensitive).
 *  - `minPrice`  — lower bound for the price range.
 *  - `maxPrice`  — upper bound for the price range.
 *  - `keyword`   — substring to search across make, model, and category fields.
 */
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

/**
 * Schema for POST /api/vehicles/:id/purchase request body.
 *
 * Rules:
 *  - `quantity` — positive integer representing the number of units to purchase.
 */
export const purchaseVehicleSchema = z.object({
  quantity: z.number().int().positive('Quantity must be greater than zero'),
});

/**
 * Schema for POST /api/vehicles/:id/restock request body.
 *
 * Rules:
 *  - `quantity` — positive integer representing the number of units to add to stock.
 */
export const restockVehicleSchema = z.object({
  quantity: z.number().int().positive('Restock quantity must be positive'),
});
