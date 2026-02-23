import { createBrowserRouter } from "react-router-dom";

/* AUTH */
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

/* GUARDS */
import {RoleRoute} from "../features/auth/RoleRoute.jsx";
import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";

/* DASHBOARD */
import DashboardLayout from "../features/dashboard/layout/DashboardLayout";
import  DashboardHome from "../features/dashboard/pages/DashboardHome";
import EventsPage from "../features/dashboard/pages/EventsPage";
import SubmissionsPage from "../features/dashboard/pages/SubmissionsPage";
import AdminUsers from "../features/dashboard/pages/AdminUsers.jsx"
import UserDetails from "../features/dashboard/pages/UserDetails.jsx";
import EventExperience from "../features/public/pages/EventExperience";
// import ProtectedRoute from "../features/auth/ProtectedRoute.jsx";
/* PUBLIC */
import HomePage from "../features/public/pages/HomePage";
import EventPage from "../features/public/pages/EventPage";
import Status from "../features/public/components/stautus.jsx";
export const router = createBrowserRouter([,


  /* ================= AUTH ================= */

  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },


  /* ================= PUBLIC (LOGIN REQUIRED) ================= */

{
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events/:id",
    element: (
      <ProtectedRoute>
        <EventPage />
      </ProtectedRoute>
    ),
  },
  // NEW EXPERIENCE ROUTE
  {
    path: "/events/:id/experience",
    element: (
      <ProtectedRoute>
        <EventExperience />
      </ProtectedRoute>
    ),
  },

  /* ================= DASHBOARD (ROLE REQUIRED) ================= */

  {
    path: "/dashboard",
    element: (
      <RoleRoute allow={["admin", "organizer"]}>
        <DashboardLayout />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "events", element: <EventsPage /> },
      { path: "submissions", element: <SubmissionsPage /> },
       {path:"users" ,element:<AdminUsers /> },
      { path:"users/:id" ,element:<UserDetails /> }
    ],
  },


  /* ================= FALLBACK ================= */
  {path:"status",element:<Status/>},
  { path: "*", element: <LoginPage /> },
],
{
    basename: "/",
  });
