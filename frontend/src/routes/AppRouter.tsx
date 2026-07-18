import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

const Home = lazy(() => import('../pages/Home').then(module => ({ default: module.Home })));
const AboutUs = lazy(() => import('../pages/AboutUs').then(module => ({ default: module.AboutUs })));
const ContactUs = lazy(() => import('../pages/ContactUs').then(module => ({ default: module.ContactUs })));
const Login = lazy(() => import('../pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('../pages/Register').then(module => ({ default: module.Register })));
const Vehicles = lazy(() => import('../pages/Vehicles').then(module => ({ default: module.Vehicles })));
const VehicleDetails = lazy(() => import('../pages/VehicleDetails').then(module => ({ default: module.VehicleDetails })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Profile = lazy(() => import('../pages/Profile').then(module => ({ default: module.Profile })));
const EditProfile = lazy(() => import('../pages/EditProfile').then(module => ({ default: module.EditProfile })));
const ChangePassword = lazy(() => import('../pages/ChangePassword').then(module => ({ default: module.ChangePassword })));
const AddVehicle = lazy(() => import('../pages/AddVehicle').then(module => ({ default: module.AddVehicle })));
const EditVehicle = lazy(() => import('../pages/EditVehicle').then(module => ({ default: module.EditVehicle })));
const Forbidden = lazy(() => import('../pages/Forbidden').then(module => ({ default: module.Forbidden })));
const NotFound = lazy(() => import('../pages/NotFound').then(module => ({ default: module.NotFound })));

const PageLoader = () => (
  <div data-testid="loading-fallback" className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
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
    </Suspense>
  );
};
