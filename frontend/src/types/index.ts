/**
 * @file types/index.ts
 * @description Shared TypeScript type definitions for the KATA frontend.
 *
 * Contains interfaces and types used across multiple modules:
 *  - User and authentication types
 *  - Vehicle domain types
 *  - API request/response payload types
 *
 * Keep this file free of runtime code — it is a types-only module.
 */

/** The possible roles a user can hold in the system. */
export type UserRole = 'ADMIN' | 'USER';

/**
 * Represents an authenticated user as returned by the API.
 * The `password` field is always omitted by the backend.
 */
export interface User {
  /** Unique database identifier (CUID). */
  id: string;
  /** Full display name of the user. */
  name: string;
  /** Email address (unique, used as login credential). */
  email: string;
  /** Role that determines the user's permissions. */
  role: UserRole;
  /** ISO 8601 timestamp of account creation (optional — not always returned). */
  createdAt?: string;
  /** ISO 8601 timestamp of last update (optional — not always returned). */
  updatedAt?: string;
}

/**
 * JWT token pair returned by the login and refresh endpoints.
 */
export interface AuthTokens {
  /** Short-lived JWT for authenticating API requests. */
  accessToken: string;
  /** Long-lived JWT for obtaining new access tokens without re-login. */
  refreshToken: string;
}

/** Request payload for the POST /api/auth/login endpoint. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Request payload for the POST /api/auth/register endpoint. */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

/**
 * Successful response data from POST /api/auth/login.
 * Contains both tokens and the authenticated user for immediate state hydration.
 */
export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Represents a single vehicle in the inventory.
 */
export interface Vehicle {
  /** Unique database identifier (CUID). */
  id: string;
  /** Manufacturer name (e.g. "Toyota"). */
  make: string;
  /** Model name (e.g. "Camry"). */
  model: string;
  /** Model year (e.g. 2024). */
  year: number;
  /** Category / body style (e.g. "Sedan", "SUV"). */
  category: string;
  /** Price in Indian Rupees (INR). */
  price: number;
  /** Number of units currently in stock. */
  quantity: number;
  /** URL pointing to a vehicle image. */
  imageUrl: string;
  /** ISO 8601 timestamp of record creation. */
  createdAt?: string;
  /** ISO 8601 timestamp of last update. */
  updatedAt?: string;
}

/**
 * Paginated vehicle list response from GET /api/vehicles.
 */
export interface PaginatedVehicles {
  /** The vehicles on the current page. */
  data: Vehicle[];
  /** The current page number (1-indexed). */
  page: number;
  /** The maximum number of items per page. */
  limit: number;
  /** Total number of vehicles matching the current filters. */
  total: number;
  /** Total number of pages for the current result set. */
  totalPages: number;
}

/**
 * Query parameters for GET /api/vehicles (list with filtering, sorting, and pagination).
 */
export interface GetVehiclesQuery {
  page?: number;
  limit?: number;
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  /** `true` = in-stock only; `false` = out-of-stock only. */
  availability?: boolean;
  sortBy?: 'price' | 'make' | 'model' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Query parameters for GET /api/vehicles/search (keyword/filter search).
 */
export interface SearchVehiclesQuery {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Searches across make, model, and category fields. */
  keyword?: string;
}

/**
 * Request payload for POST /api/vehicles (create a new vehicle).
 */
export interface CreateVehiclePayload {
  make: string;
  model: string;
  year: number;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

/**
 * Request payload for PUT /api/vehicles/:id (update an existing vehicle).
 * All fields are optional — only include the fields to change.
 */
export type UpdateVehiclePayload = Partial<CreateVehiclePayload>;

/**
 * Generic wrapper for all API responses.
 * @template T - The type of the response data payload.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
