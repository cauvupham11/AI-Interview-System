import { Outlet } from "react-router-dom";
import LeftSidebar from "../shared/components/navigation/LeftSidebar";
import Topbar from "../shared/components/navigation/Topbar";
import "../shared/styles/app-shell.css";

function DashboardLayout() {
  return (
    <div className="app-shell">
      <div className="app-layout">
        <LeftSidebar />
        <div className="app-main-area">
          <Topbar />
          <main className="app-main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
