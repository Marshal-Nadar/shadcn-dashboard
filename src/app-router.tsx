import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DashboardLayout } from "./components/dashboard-layout";
import { DashboardPage } from "./components/dashboard-page";
import { OrdersPage } from "./pages/orders-page";
import { ProductsPage } from "./pages/products-page";
import { CustomersPage } from "./pages/customers-page";
import { AnalyticsPage } from "./pages/analytics-page";
import { AuthPage } from "./pages/auth-page";
import { ProtectedRoute } from "./components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { ExpenseTypesPage } from "./pages/expense-types-page";

// Create a component to handle the root redirect
function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/auth" replace />
  );
}

export function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Root path redirects based on auth status */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OrdersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ExpenseTypesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProductsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CustomersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to auth */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}
