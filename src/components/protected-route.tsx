import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated); // Debug log

  if (!isAuthenticated) {
    console.log("Redirecting to /auth"); // Debug log
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
