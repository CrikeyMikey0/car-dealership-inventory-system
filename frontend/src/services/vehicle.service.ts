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
  getVehicles: async (query?: GetVehiclesQuery): Promise<PaginatedVehicles> => {
    const response = await apiClient.get<{ success: boolean; data: PaginatedVehicles }>('/vehicles', { params: query });
    return response.data.data;
  },

  getVehicleById: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.get<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`);
    return response.data.data;
  },

  searchVehicles: async (query?: SearchVehiclesQuery): Promise<Vehicle[]> => {
    const response = await apiClient.get<{ success: boolean; data: Vehicle[] }>('/vehicles/search', { params: query });
    return response.data.data;
  },

  createVehicle: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const response = await apiClient.post<{ success: boolean; data: Vehicle }>('/vehicles', payload);
    return response.data.data;
  },

  updateVehicle: async (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const response = await apiClient.put<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`, payload);
    return response.data.data;
  },

  deleteVehicle: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/vehicles/${id}`);
    return response.data;
  },

  purchaseVehicle: async (id: string, quantity: number): Promise<Vehicle> => {
    const response = await apiClient.post<{ success: boolean; data: Vehicle }>(`/vehicles/${id}/purchase`, { quantity });
    return response.data.data;
  },

  restockVehicle: async (id: string, quantity: number): Promise<Vehicle> => {
    const response = await apiClient.post<{ success: boolean; data: Vehicle }>(`/vehicles/${id}/restock`, { quantity });
    return response.data.data;
  },
};
