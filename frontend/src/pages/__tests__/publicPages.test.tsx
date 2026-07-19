import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../Home';
import { Vehicles } from '../Vehicles';
import { VehicleDetails } from '../VehicleDetails';
import { vehicleService } from '../../services/vehicle.service';
import { AuthContext } from '../../contexts/AuthContext';
import { notify } from '../../utils/notification';

vi.mock('../../services/vehicle.service', () => ({
  vehicleService: {
    getVehicles: vi.fn().mockResolvedValue({ data: [], page: 1, limit: 10, total: 0, totalPages: 0 }),
    getVehicleById: vi.fn().mockResolvedValue({ id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'}),
    searchVehicles: vi.fn().mockResolvedValue([]),
    purchaseVehicle: vi.fn(),
    restockVehicle: vi.fn(),
    deleteVehicle: vi.fn(),
  },
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock('../../utils/notification', () => ({
  notify: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('Public Pages', () => {
  const userAuthContext = {
    user: { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'USER' as const },
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Home Page', () => {
    it('renders hero section, call to action, statistics, and about section', async () => {
      vi.mocked(vehicleService.getVehicles).mockResolvedValue({
        data: [
          { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'},
          { id: 'v2', make: 'Ford', model: 'Mustang', year: 2022, category: 'Coupe', price: 35000, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'}
        ],
        page: 1,
        limit: 4,
        total: 2,
        totalPages: 1,
      });

      render(
        <MemoryRouter>
          <AuthContext.Provider value={userAuthContext}>
            <Home />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: /Find Your Dream Vehicle/i })).toBeInTheDocument();
      expect(screen.getByText(/Explore Inventory/i)).toBeInTheDocument();
      expect(screen.getByText(/About KATA/i)).toBeInTheDocument();
      
      // Carousel checks
      await waitFor(() => {
        expect(screen.getAllByText(/Tesla/i).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Vehicles Listing Page', () => {
    it('fetches vehicles and displays search bar, filter controls and pagination', async () => {
      const mockData = {
        data: [
          { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'},
          { id: 'v2', make: 'Ford', model: 'F-150', year: 2022, category: 'Truck', price: 38500, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'},
        ],
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      };
      vi.mocked(vehicleService.getVehicles).mockResolvedValue(mockData);

      render(
        <MemoryRouter>
          <AuthContext.Provider value={userAuthContext}>
            <Vehicles />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByPlaceholderText(/search by make, model, or category/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getAllByText(/Tesla/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Ford/i).length).toBeGreaterThan(0);
      });
    });

    it('triggers search when keyword filter is typed', async () => {
      const mockData = {
        data: [{ id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'}],
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      };
      vi.mocked(vehicleService.getVehicles).mockResolvedValue(mockData);

      render(
        <MemoryRouter>
          <AuthContext.Provider value={userAuthContext}>
            <Vehicles />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(/search by make, model, or category/i);
      fireEvent.change(searchInput, { target: { value: 'Tesla' } });
      fireEvent.click(screen.getByRole('button', { name: /apply search/i }));

      await waitFor(() => {
        expect(vehicleService.getVehicles).toHaveBeenCalledWith(expect.objectContaining({ make: 'Tesla' }));
      });
    });
  });

  describe('VehicleDetails Page', () => {
    it('fetches vehicle specs and allows purchasing', async () => {
      const mockVehicle = { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'};
      vi.mocked(vehicleService.getVehicleById).mockResolvedValue(mockVehicle);
      vi.mocked(vehicleService.purchaseVehicle).mockResolvedValue({ ...mockVehicle, quantity: 3, imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'});

      render(
        <MemoryRouter initialEntries={['/vehicles/v1']}>
          <AuthContext.Provider value={userAuthContext}>
            <Routes>
              <Route path="/vehicles/:id" element={<VehicleDetails />} />
            </Routes>
          </AuthContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(/2023 Tesla Model 3/i)).toBeInTheDocument();
      });

      const purchaseBtn = screen.getByRole('button', { name: /purchase vehicle/i });
      fireEvent.click(purchaseBtn);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /confirm purchase/i })).toBeInTheDocument();
      });

      const confirmBtn = screen.getByRole('button', { name: /confirm purchase/i });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(vehicleService.purchaseVehicle).toHaveBeenCalledWith('v1', 1);
        expect(notify.success).toHaveBeenCalled();
      });
    });
  });
});
