import { useAuthStore } from "./auth.store";

export function useAuth() {
  const { user, token } = useAuthStore();

  return {
    user,
    token,
    isAdmin: user?.role === "admin",
    isOrganizer: user?.role === "organizer",
    isParticipant: user?.role === "participant",
  };
}
