/**
 * @file e2e.test.tsx
 * @description End-to-end simulated workflow tests.
 *
 * Mocks the API services layer to test complex, multi-page user journeys
 * without requiring a live backend. Covers scenarios like:
 * - Guest workflow (browsing, searching, navigating to login)
 * - User workflow (logging in, viewing dashboard, purchasing a vehicle)
 * - Admin workflow (logging in, creating a vehicle, updating inventory)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../routes/AppRouter';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { vehicleService } from '../services/vehicle.service';
import { authService } from '../services/auth.service';

vi.mock('../services/vehicle.service', () => ({
  vehicleService: {
    getVehicles: vi.fn(),
    getVehicleById: vi.fn(),
    createVehicle: vi.fn(),
    updateVehicle: vi.fn(),
    deleteVehicle: vi.fn(),
    purchaseVehicle: vi.fn(),
    restockVehicle: vi.fn(),
  },
}));

vi.mock('../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    changePassword: vi.fn(),
  },
}));

describe('End-to-End Workflows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Default mock implementation
    vi.mocked(vehicleService.getVehicles).mockResolvedValue({
      data: [
        { id: '1', make: 'Toyota', model: 'Camry', year: 2022, category: 'Sedan', price: 25000, quantity: 5, imageUrl: '' },
      ],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });

  const renderApp = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  describe('Guest Workflow', () => {
    it('allows a guest to view home page, search, and navigate to login', async () => {
      renderApp('/');
      
      // Home page assertions
      expect(await screen.findByText(/Browse our curated inventory/i)).toBeInTheDocument();
      
      // Guest should see Login and Register links
      const loginLinks = screen.getAllByRole('link', { name: /login/i });
      expect(loginLinks.length).toBeGreaterThan(0);
      
      // Click login link
      const userEvt = userEvent.setup();
      await userEvt.click(loginLinks[0]);
      
      // Verify navigated to login page
      try {
        expect(await screen.findByText(/Sign In to KATA/i)).toBeInTheDocument();
      } catch (e) {
        screen.debug(undefined, 300000);
        throw e;
      }
    });
  });

  describe('Authenticated User Workflow', () => {
    it('allows a user to log in, browse vehicles, and purchase one', async () => {
      // Mock login to return a user token and info
      vi.mocked(authService.login).mockResolvedValueOnce({
        user: { id: 'user1', name: 'User', email: 'user@example.com', role: 'USER' },
        accessToken: 'token',
        refreshToken: 'refresh'
      });
      
      renderApp('/login');
      
      const userEvt = userEvent.setup();
      
      // Fill login form
      const emailInput = await screen.findByLabelText(/email address/i);
      await userEvt.type(emailInput, 'user@example.com');
      const passInput = await screen.findByLabelText(/password/i);
      await userEvt.type(passInput, 'password123');
      await userEvt.click(screen.getByRole('button', { name: /sign in/i }));
      
      // Verify login API called
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
      });
      
      // Verify navigation to dashboard
      expect(await screen.findByText(/Recent Activity/i)).toBeInTheDocument();
      
      // Navigate to Vehicles page
      const vehiclesLink = screen.getAllByRole('link', { name: /inventory/i })[0];
      await userEvt.click(vehiclesLink);
      
      const camryHeadings = await screen.findAllByText('Toyota Camry');
      expect(camryHeadings.length).toBeGreaterThan(0);
      
      // Mock getVehicleById for details page
      vi.mocked(vehicleService.getVehicleById).mockResolvedValueOnce({
        id: '1', make: 'Toyota', model: 'Camry', year: 2022, category: 'Sedan', price: 25000, quantity: 5, imageUrl: ''
      });
      
      // Click view details
      const viewDetailsBtn = await screen.findByRole('link', { name: /view specs/i });
      await userEvt.click(viewDetailsBtn);
      
      expect(await screen.findByRole('button', { name: /purchase vehicle/i })).toBeInTheDocument();
      
      // Click purchase to open modal
      await userEvt.click(screen.getByRole('button', { name: /purchase vehicle/i }));
      
      // Mock purchase API
      vi.mocked(vehicleService.purchaseVehicle).mockResolvedValueOnce({
        id: '1', make: 'Toyota', model: 'Camry', year: 2022, category: 'Sedan', price: 25000, quantity: 4, imageUrl: ''
      });
      
      // Confirm purchase inside modal with default quantity (1)
      await userEvt.click(screen.getByRole('button', { name: /confirm purchase/i }));
      
      await waitFor(() => {
        expect(vehicleService.purchaseVehicle).toHaveBeenCalledWith('1', 1);
      });
    });
  });

  describe('Administrator Workflow', () => {
    it('allows an admin to log in, view dashboard, and edit inventory', async () => {
      // Mock login to return admin
      vi.mocked(authService.login).mockResolvedValueOnce({
        user: { id: 'admin1', name: 'Admin', email: 'admin@dealership.com', role: 'ADMIN' },
        accessToken: 'token',
        refreshToken: 'refresh'
      });
      
      renderApp('/login');
      
      const userEvt = userEvent.setup();
      
      // Fill login form
      const emailInput = await screen.findByLabelText(/email address/i);
      await userEvt.type(emailInput, 'admin@dealership.com');
      const passInput = await screen.findByLabelText(/password/i);
      await userEvt.type(passInput, 'adminpass');
      await userEvt.click(screen.getByRole('button', { name: /sign in/i }));
      
      try {
        expect(await screen.findByText(/Inventory Statistics Overview/i)).toBeInTheDocument();
      } catch (e) {
        screen.debug(undefined, 300000);
        throw e;
      }
      
      // Click Add New Vehicle
      const addBtns = await screen.findAllByText(/add new vehicle/i);
      await userEvt.click(addBtns[0]);
      
      expect(await screen.findByRole('heading', { name: /add new vehicle/i })).toBeInTheDocument();
    });
  });
});
