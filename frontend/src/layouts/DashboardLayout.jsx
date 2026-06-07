import { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../shared/components/navigation/LeftSidebar";
import Topbar from "../shared/components/navigation/Topbar";
import "../shared/styles/app-shell.css";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="app-layout">
        <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <button
          aria-label="Đóng menu"
          className={`app-sidebar-backdrop ${isSidebarOpen ? "app-sidebar-backdrop-visible" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
        <div className="app-main-area">
          <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
          <main className="app-main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
