import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/AdminLayout';
import DashboardPage from './pages/DashboardPage';
import MessagesPage from './pages/MessagesPage';
import UsersPage from './pages/UsersPage';

const IS_UNLOCKED = () => sessionStorage.getItem('bll_admin_unlocked') === 'true';

const Guard = ({ children }: { children: React.ReactNode }) => {
  if (!IS_UNLOCKED()) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Guard>
              <AdminLayout />
            </Guard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
