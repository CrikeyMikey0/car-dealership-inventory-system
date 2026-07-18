import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Vehicles } from '../pages/Vehicles';
import { VehicleDetails } from '../pages/VehicleDetails';
import { Dashboard } from '../pages/Dashboard';
import { Profile } from '../pages/Profile';
import { EditProfile } from '../pages/EditProfile';
import { ChangePassword } from '../pages/ChangePassword';
import { AddVehicle } from '../pages/AddVehicle';
import { EditVehicle } from '../pages/EditVehicle';
import { Forbidden } from '../pages/Forbidden';
import { NotFound } from '../pages/NotFound';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/vehicles/:id" element={<VehicleDetails />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* Admin Only Routes */}
      <Route
        path="/vehicles/new"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AddVehicle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/:id/edit"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <EditVehicle />
          </ProtectedRoute>
        }
      />

      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
