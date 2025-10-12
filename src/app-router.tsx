import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/dashboard-layout";
import { DashboardPage } from "./components/dashboard-page";
import { OrdersPage } from "./pages/orders-page";
import { ProductsPage } from "./pages/products-page";
import { CustomersPage } from "./pages/customers-page";
import { AnalyticsPage } from "./pages/analytics-page";

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <DashboardLayout>
              <OrdersPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/products"
          element={
            <DashboardLayout>
              <ProductsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/customers"
          element={
            <DashboardLayout>
              <CustomersPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}
