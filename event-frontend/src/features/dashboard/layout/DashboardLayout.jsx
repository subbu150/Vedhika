import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="dash-root">

      <Sidebar open={open} setOpen={setOpen} />

      <div className="dash-main">
        <Header setOpen={setOpen} />
        <div className="dash-content">
          <Outlet />
        </div>
      </div>

    </div>
  );
}
