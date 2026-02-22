import { Navigate } from "react-router-dom";
import { useAuthStore } from "./auth.store";

export function RoleRoute({ allow, children }) {

  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  console.log("RoleRoute render:", {
  token,
  user
});
  /* not logged in */
  if (!token) return <Navigate to="/login" />;

  /* still loading user */
  if (!user) return null;   // wait until hydrated

  /* role not allowed */
  if (!allow.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
