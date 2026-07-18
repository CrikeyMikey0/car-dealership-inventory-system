import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../Dashboard';
import { Profile } from '../Profile';
import { EditProfile } from '../EditProfile';
import { AddVehicle } from '../AddVehicle';
import { EditVehicle } from '../EditVehicle';
import { vehicleService } from '../../services/vehicle.service';
import { AuthContext } from '../../contexts/AuthContext';
import { notify } from '../../utils/notification';

vi.mock('../../services/vehicle.service', () => ({
  vehicleService: {
    getVehicles: vi.fn(),
    getVehicleById: vi.fn(),
    createVehicle: vi.fn(),
    updateVehicle: vi.fn(),
  },
}));

vi.mock('../../utils/notification', () => ({
  notify: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Protected & Admin Pages', () => {
  const adminUser = { id: 'a1', name: 'System Administrator', email: 'admin@dealership.com', role: 'ADMIN' as const };
  const regularUser = { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'USER' as const };
  const mockUpdateUser = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dashboard Page', () => {
    it('displays user profile information, role badge and statistics overview', async () => {
      vi.mocked(vehicleService.getVehicles).mockResolvedValueOnce({
        data: [
          { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3 },
          { id: 'v2', make: 'Ford', model: 'F-150', year: 2022, category: 'Truck', price: 38500, quantity: 0 },
        ],
        page: 1,
        limit: 100,
        total: 2,
        totalPages: 1,
      });

      render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{ user: adminUser, isAuthenticated: true, isLoading: false, login: vi.fn(), logout: mockLogout, updateUser: mockUpdateUser }}
          >
            <Dashboard />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByText(/System Administrator/i)).toBeInTheDocument();
      expect(screen.getByText(/admin@dealership.com/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(/Total Models/i)).toBeInTheDocument();
      });
    });
  });

  describe('Profile & Edit Profile Pages', () => {
    it('renders user details in Profile page and provides logout & edit triggers', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{ user: regularUser, isAuthenticated: true, isLoading: false, login: vi.fn(), logout: mockLogout, updateUser: mockUpdateUser }}
          >
            <Profile />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
      expect(mockLogout).toHaveBeenCalled();
    });

    it('submits updated profile info on Edit Profile page', async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{ user: regularUser, isAuthenticated: true, isLoading: false, login: vi.fn(), logout: mockLogout, updateUser: mockUpdateUser }}
          >
            <EditProfile />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/full name/i);
      fireEvent.change(nameInput, { target: { value: 'John Smith' } });
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Smith' }));
        expect(notify.success).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
      });
    });
  });

  describe('Add Vehicle Page (Admin)', () => {
    it('submits vehicle creation form and navigates to inventory on success', async () => {
      const mockCreated = { id: 'v3', make: 'BMW', model: 'i4', year: 2023, category: 'Electric', price: 52000, quantity: 4 };
      vi.mocked(vehicleService.createVehicle).mockResolvedValueOnce(mockCreated);

      render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{ user: adminUser, isAuthenticated: true, isLoading: false, login: vi.fn(), logout: mockLogout, updateUser: mockUpdateUser }}
          >
            <AddVehicle />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/^make$/i), { target: { value: 'BMW' } });
      fireEvent.change(screen.getByLabelText(/^model$/i), { target: { value: 'i4' } });
      fireEvent.change(screen.getByLabelText(/model year/i), { target: { value: 2023 } });
      fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Electric' } });
      fireEvent.change(screen.getByLabelText(/listing price/i), { target: { value: 52000 } });
      fireEvent.change(screen.getByLabelText(/stock quantity/i), { target: { value: 4 } });

      fireEvent.click(screen.getByRole('button', { name: /add vehicle/i }));

      await waitFor(() => {
        expect(vehicleService.createVehicle).toHaveBeenCalledWith({
          make: 'BMW',
          model: 'i4',
          year: 2023,
          category: 'Electric',
          price: 52000,
          quantity: 4,
          imageUrl: '',
        });
        expect(notify.success).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/vehicles');
      });
    });
  });

  describe('Edit Vehicle Page (Admin)', () => {
    it('loads existing vehicle and updates fields on submission', async () => {
      const mockVehicle = { id: 'v1', make: 'Tesla', model: 'Model 3', year: 2023, category: 'Electric', price: 42990, quantity: 3 };
      vi.mocked(vehicleService.getVehicleById).mockResolvedValueOnce(mockVehicle);
      vi.mocked(vehicleService.updateVehicle).mockResolvedValueOnce({ ...mockVehicle, price: 44000 });

      render(
        <MemoryRouter initialEntries={['/vehicles/v1/edit']}>
          <AuthContext.Provider
            value={{ user: adminUser, isAuthenticated: true, isLoading: false, login: vi.fn(), logout: mockLogout, updateUser: mockUpdateUser }}
          >
            <Routes>
              <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
            </Routes>
          </AuthContext.Provider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Tesla')).toBeInTheDocument();
      });

      const priceInput = screen.getByLabelText(/listing price/i);
      fireEvent.change(priceInput, { target: { value: 44000 } });
      fireEvent.click(screen.getByRole('button', { name: /update vehicle/i }));

      await waitFor(() => {
        expect(vehicleService.updateVehicle).toHaveBeenCalledWith('v1', expect.objectContaining({ price: 44000 }));
        expect(notify.success).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/vehicles/v1');
      });
    });
  });
});
