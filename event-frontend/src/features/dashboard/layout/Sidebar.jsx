import { NavLink } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>

      <h2 className="logo"><b>వేధిక</b></h2>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/dashboard/events">Events</NavLink>
        <NavLink to="/dashboard/submissions">Submissions</NavLink>
        <NavLink to="/dashboard/users">Authorize to Admin</NavLink>
        <NavLink to="/">Public Event Page</NavLink>
      </nav>

      <button
        className="logout"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </aside>
  );
}
