/**
 * @file AppRouter.tsx
 * @description Declarative application route map.
 *
 * Uses React Router v6 `<Routes>` / `<Route>` with code-splitting via
 * `React.lazy()` and `<Suspense>` so each page bundle is loaded on demand,
 * reducing the initial JavaScript payload.
 *
 * Access levels:
 *  - Public routes — accessible without authentication (Home, Vehicles, About, Contact).
 *  - Auth-only routes — wrapped in `<PublicRoute>` which redirects authenticated
 *    users to the dashboard (Login, Register).
 *  - Protected routes — wrapped in `<ProtectedRoute>` which redirects
 *    unauthenticated users to login (Dashboard, Profile, etc.).
 *  - Admin-only routes — `<ProtectedRoute requiredRole="ADMIN">` which
 *    redirects non-admin users to /403 (Add Vehicle, Edit Vehicle).
 *
 * Important: The `/vehicles/new` route must be registered BEFORE `/vehicles/:id`
 * to prevent "new" from being treated as a dynamic ID parameter.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

// ─── Lazy-loaded page components ────────────────────────────────────────────
// Each import creates a separate bundle chunk loaded only when the route is visited.

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
const ComingSoon = lazy(() => import('../pages/ComingSoon').then(module => ({ default: module.ComingSoon })));

/**
 * Loading spinner shown by `<Suspense>` while a lazy page chunk is being fetched.
 */
const PageLoader = () => (
  <div data-testid="loading-fallback" className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

/**
 * Root router component that declares all application routes.
 *
 * Renders a `<Suspense>` boundary so that all lazy-loaded pages show the
 * `PageLoader` spinner while their bundle is downloading.
 */
export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public routes ─────────────────────────────────────────────── */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        <Route path="/privacy" element={<ComingSoon title="Privacy Policy" />} />
        <Route path="/terms" element={<ComingSoon title="Terms of Service" />} />

        {/* ── Auth-only routes (redirect authenticated users to dashboard) ─ */}
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

        {/* ── Protected routes (redirect unauthenticated users to login) ── */}
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

        {/* ── Admin-only routes (redirect non-admin users to /403) ─────── */}
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

        {/* ── Error pages ───────────────────────────────────────────────── */}
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
