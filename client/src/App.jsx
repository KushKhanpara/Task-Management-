import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Loader from './components/shared/Loader';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';

// Lazy load pages for optimal performance (Code Splitting)
const Login = lazy(() => import('./pages/Login'));
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ManageUsers = lazy(() => import('./pages/ManageUsers'));
const ManageTasks = lazy(() => import('./pages/ManageTasks'));
const ManageProjects = lazy(() => import('./pages/ManageProjects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const DailyLogs = lazy(() => import('./pages/DailyLogs'));
const Profile = lazy(() => import('./pages/Profile'));
const Subscription = lazy(() => import('./pages/Subscription'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));
const AboutContact = lazy(() => import('./pages/AboutContact'));

// Full Screen Loading Wrapper
const FullScreenLoader = () => (
  <div className="flex items-center justify-center h-screen bg-transparent">
    <Loader />
  </div>
);

const RequireAuth = () => {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const RequireAdmin = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

// Animated Route Wrapper
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={
        <Suspense fallback={<div>Loading Login...</div>}>
          <Login />
        </Suspense>
      } />
      <Route path="/about" element={
        <Suspense fallback={<FullScreenLoader />}>
          <AboutContact />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<FullScreenLoader />}>
          <AboutContact />
        </Suspense>
      } />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={
            <Suspense fallback={<FullScreenLoader />}>
              <PageTransition><EmployeeDashboard /></PageTransition>
            </Suspense>
          } />
          <Route path="/daily-logs" element={
            <Suspense fallback={<FullScreenLoader />}>
              <PageTransition><DailyLogs /></PageTransition>
            </Suspense>
          } />
          <Route path="/profile" element={
            <Suspense fallback={<FullScreenLoader />}>
              <PageTransition><Profile /></PageTransition>
            </Suspense>
          } />
          <Route path="/subscription" element={
            <Suspense fallback={<FullScreenLoader />}>
              <PageTransition><Subscription /></PageTransition>
            </Suspense>
          } />
          <Route path="/payment-success" element={
            <Suspense fallback={<FullScreenLoader />}>
              <PageTransition><PaymentSuccess /></PageTransition>
            </Suspense>
          } />
          <Route path="/payment-cancel" element={
            <Suspense fallback={<FullScreenLoader />}>
              <PageTransition><PaymentCancel /></PageTransition>
            </Suspense>
          } />

          {/* Admin Routes */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={
              <Suspense fallback={<FullScreenLoader />}>
                <PageTransition><AdminDashboard /></PageTransition>
              </Suspense>
            } />
            <Route path="/admin/users" element={
              <Suspense fallback={<FullScreenLoader />}>
                <PageTransition><ManageUsers /></PageTransition>
              </Suspense>
            } />
            <Route path="/admin/projects" element={
              <Suspense fallback={<FullScreenLoader />}>
                <PageTransition><ManageProjects /></PageTransition>
              </Suspense>
            } />
            <Route path="/admin/projects/:id" element={
              <Suspense fallback={<FullScreenLoader />}>
                <PageTransition><ProjectDetails /></PageTransition>
              </Suspense>
            } />
            <Route path="/admin/tasks" element={
              <Suspense fallback={<FullScreenLoader />}>
                <PageTransition><ManageTasks /></PageTransition>
              </Suspense>
            } />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
