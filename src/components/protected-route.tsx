import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { verifyToken } from "@/store/slices/authSlice";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, loading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(verifyToken(token));
    }
  }, [token, isAuthenticated, dispatch]);

  if (loading) {
    return <div>Loading...</div>; // You can replace with a proper loader
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
