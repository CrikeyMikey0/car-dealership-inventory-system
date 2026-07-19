/**
 * @file vehicle.service.ts
 * @description Frontend HTTP service for vehicle inventory API calls.
 *
 * Wraps all vehicle-related API endpoints exposed by the backend.
 * All methods use the shared `apiClient` Axios instance which handles
 * automatic JWT token attachment, and token refresh on 401 responses.
 *
 * Access levels:
 *  - `getVehicles`, `getVehicleById`, `searchVehicles` — public (no auth required).
 *  - `purchaseVehicle` — requires authentication (any role).
 *  - `createVehicle`, `updateVehicle`, `deleteVehicle`, `restockVehicle` — ADMIN only.
 */

import apiClient from '../api/apiClient';
import {
  Vehicle,
  PaginatedVehicles,
  GetVehiclesQuery,
  SearchVehiclesQuery,
  CreateVehiclePayload,
  UpdateVehiclePayload,
} from '../types';

export const vehicleService = {
  /**
   * Fetches a paginated list of vehicles based on filter criteria.
   * @param query - Optional query parameters including pagination and filters (make, category, minPrice, maxPrice, sortBy).
   * @returns A promise that resolves to paginated vehicle data.
   */
  getVehicles: async (query?: GetVehiclesQuery): Promise<PaginatedVehicles> => {
    const response = await apiClient.get<{ success: boolean; data: PaginatedVehicles }>('/vehicles', { params: query });
    return response.data.data;
  },

  /**
   * Fetches details of a specific vehicle by ID.
   * @param id - The unique identifier of the vehicle.
   * @returns A promise that resolves to the vehicle details.
   */
  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`);
    return response.data.data;
  },

  /**
   * Searches for vehicles based on a text query.
   * @param query - Optional query parameters containing the search term.
   * @returns A promise that resolves to a list of matching vehicles.
   */
  searchVehicles: async (query?: SearchVehiclesQuery): Promise<Vehicle[]> => {
    const response = await apiClient.get<{ success: boolean; data: Vehicle[] }>('/vehicles/search', { params: query });
    return response.data.data;
  },

  /**
   * Creates a new vehicle in the inventory (Admin only).
   * @param payload - The data for the new vehicle.
   * @returns A promise that resolves to the created vehicle.
   */
  createVehicle: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const response = await apiClient.post<{ success: boolean; data: Vehicle }>('/vehicles', payload);
    return response.data.data;
  },

  /**
   * Updates an existing vehicle's details (Admin only).
   * @param id - The unique identifier of the vehicle to update.
   * @param payload - The updated vehicle data.
   * @returns A promise that resolves to the updated vehicle.
   */
  updateVehicle: async (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const response = await apiClient.put<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`, payload);
    return response.data.data;
  },

  /**
   * Deletes a vehicle from the inventory (Admin only).
   * @param id - The unique identifier of the vehicle to delete.
   * @returns A promise indicating success and a message.
   */
  deleteVehicle: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Simulates a user purchasing a specified quantity of a vehicle.
   * Reduces the inventory stock level.
   * @param id - The vehicle ID.
   * @param quantity - The number of vehicles to purchase.
   * @returns A promise that resolves to the updated vehicle details.
   */
  purchaseVehicle: async (id: string, quantity: number): Promise<Vehicle> => {
    const response = await apiClient.post<{ success: boolean; data: Vehicle }>(`/vehicles/${id}/purchase`, { quantity });
    return response.data.data;
  },

  /**
   * Increases the inventory stock for a given vehicle (Admin only).
   * @param id - The vehicle ID.
   * @param quantity - The number of vehicles to add to stock.
   * @returns A promise that resolves to the updated vehicle details.
   */
  restockVehicle: async (id: string, quantity: number): Promise<Vehicle> => {
    const response = await apiClient.post<{ success: boolean; data: Vehicle }>(`/vehicles/${id}/restock`, { quantity });
    return response.data.data;
  },
};
