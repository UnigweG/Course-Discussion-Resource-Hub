import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Public pages
import HomePage from '../pages/public/HomePage';
import SearchPage from '../pages/public/SearchPage';
import ThreadDetailPage from '../pages/public/ThreadDetailPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// User pages
import DashboardPage from '../pages/user/DashboardPage';
import ProfilePage from '../pages/user/ProfilePage';
import ActivityPage from '../pages/user/ActivityPage';
import MeetupsPage from '../pages/user/MeetupsPage';
import SubmitDiscussionPage from '../pages/user/SubmitDiscussionPage';
import ResourcesPage from '../pages/user/ResourcesPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public — browsable without an account */}
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="threads/:threadId" element={<ThreadDetailPage />} />
        <Route path="meetups" element={<MeetupsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected — requires authentication to create content */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="submit" element={<SubmitDiscussionPage />} />
        </Route>

        {/* Admin — requires admin role */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
