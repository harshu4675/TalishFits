import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PageLoader } from "./components/ui/Loader";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const VerifyOTP = lazy(() => import("./pages/auth/VerifyOTP"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Onboarding = lazy(() => import("./pages/onboarding/Onboarding"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Workout = lazy(() => import("./pages/workout/Workout"));
const Diet = lazy(() => import("./pages/diet/Diet"));
const Progress = lazy(() => import("./pages/progress/Progress"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const Achievements = lazy(() => import("./pages/achievements/Achievements"));
const Notifications = lazy(() => import("./pages/notifications/Notifications"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const OnboardingRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isOnboarded) return <Navigate to="/dashboard" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (isAuthenticated) {
    return isOnboarded ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Navigate to="/onboarding" replace />
    );
  }
  return children;
};

const DashboardRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardRoute>
              <Dashboard />
            </DashboardRoute>
          }
        />
        <Route
          path="/workout"
          element={
            <DashboardRoute>
              <Workout />
            </DashboardRoute>
          }
        />
        <Route
          path="/diet"
          element={
            <DashboardRoute>
              <Diet />
            </DashboardRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <DashboardRoute>
              <Progress />
            </DashboardRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardRoute>
              <Profile />
            </DashboardRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <DashboardRoute>
              <Achievements />
            </DashboardRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <DashboardRoute>
              <Notifications />
            </DashboardRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
