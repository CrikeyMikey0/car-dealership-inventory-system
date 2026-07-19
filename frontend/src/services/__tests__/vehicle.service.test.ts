import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vehicleService } from '../vehicle.service';
import apiClient from '../../api/apiClient';

vi.mock('../../api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('vehicleService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getVehicles fetches paginated vehicles list', async () => {
    const mockData = {
      data: [{ id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'}],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    };
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { success: true, data: mockData } });

    const result = await vehicleService.getVehicles({ page: 1, category: 'Electric' });

    expect(apiClient.get).toHaveBeenCalledWith('/vehicles', { params: { page: 1, category: 'Electric' } });
    expect(result).toEqual(mockData);
  });

  it('getVehicleById fetches single vehicle details', async () => {
    const mockVehicle = { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'};
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { success: true, data: mockVehicle } });

    const result = await vehicleService.getVehicleById('v1');

    expect(apiClient.get).toHaveBeenCalledWith('/vehicles/v1');
    expect(result).toEqual(mockVehicle);
  });

  it('searchVehicles calls search endpoint with query params', async () => {
    const mockVehicles = [{ id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'}];
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { success: true, data: mockVehicles } });

    const result = await vehicleService.searchVehicles({ keyword: 'Tesla' });

    expect(apiClient.get).toHaveBeenCalledWith('/vehicles/search', { params: { keyword: 'Tesla' } });
    expect(result).toEqual(mockVehicles);
  });

  it('createVehicle posts new vehicle details', async () => {
    const newVehiclePayload = { make: 'Ford', model: 'F-150', year: 2022, category: 'Truck', price: 38500, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'};
    const mockCreated = { id: 'v2', ...newVehiclePayload };
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { success: true, data: mockCreated } });

    const result = await vehicleService.createVehicle(newVehiclePayload);

    expect(apiClient.post).toHaveBeenCalledWith('/vehicles', newVehiclePayload);
    expect(result).toEqual(mockCreated);
  });

  it('updateVehicle puts updated vehicle fields', async () => {
    const updatePayload = { price: 39000 };
    const mockUpdated = { id: 'v2', make: 'Ford', model: 'F-150', year: 2022, category: 'Truck', price: 39000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'};
    vi.mocked(apiClient.put).mockResolvedValueOnce({ data: { success: true, data: mockUpdated } });

    const result = await vehicleService.updateVehicle('v2', updatePayload);

    expect(apiClient.put).toHaveBeenCalledWith('/vehicles/v2', updatePayload);
    expect(result).toEqual(mockUpdated);
  });

  it('deleteVehicle sends DELETE request', async () => {
    vi.mocked(apiClient.delete).mockResolvedValueOnce({ data: { success: true, message: 'Vehicle deleted successfully' } });

    const result = await vehicleService.deleteVehicle('v2');

    expect(apiClient.delete).toHaveBeenCalledWith('/vehicles/v2');
    expect(result).toEqual({ success: true, message: 'Vehicle deleted successfully' });
  });

  it('purchaseVehicle calls purchase endpoint with quantity payload', async () => {
    const mockPurchased = { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'};
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { success: true, data: mockPurchased } });

    const result = await vehicleService.purchaseVehicle('v1', 1);

    expect(apiClient.post).toHaveBeenCalledWith('/vehicles/v1/purchase', { quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'});
    expect(result).toEqual(mockPurchased);
  });

  it('restockVehicle calls restock endpoint with quantity payload', async () => {
    const mockRestocked = { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'};
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { success: true, data: mockRestocked } });

    const result = await vehicleService.restockVehicle('v1', 7);

    expect(apiClient.post).toHaveBeenCalledWith('/vehicles/v1/restock', { quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'});
    expect(result).toEqual(mockRestocked);
  });
});
