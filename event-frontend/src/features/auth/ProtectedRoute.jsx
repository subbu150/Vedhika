import { Navigate } from "react-router-dom";
import { useAuthStore } from "./auth.store";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);

  if (!token) return <Navigate to="/login" />;

  return children;
}
