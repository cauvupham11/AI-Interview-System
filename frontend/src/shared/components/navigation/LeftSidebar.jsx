import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import plusIcon from "../../../assets/icons/plus.svg";
import interviewIcon from "../../../assets/icons/interview.svg";
import historyIcon from "../../../assets/icons/history.svg";
import settingsIcon from "../../../assets/icons/settings.svg";
import helpIcon from "../../../assets/icons/help.svg";
import logoutIcon from "../../../assets/icons/logout.svg";
import profileIcon from "../../../assets/icons/profile.svg";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../../features/auth/hooks/useAuth";

const menuItems = [
  { label: "Phỏng vấn mới", path: ROUTES.interviewSetup, icon: plusIcon },
  { label: "Phòng phỏng vấn", path: ROUTES.interviewRoom, icon: interviewIcon },
  { label: "Lịch sử", path: ROUTES.history, icon: historyIcon },
  // { label: "Cài đặt", path: "/settings", icon: settingsIcon },
];

function LeftSidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate();
  const { account, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      await logout();
      navigate(ROUTES.login, { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className={`app-sidebar ${isOpen ? "app-sidebar-open" : ""}`}>
      <div className="app-sidebar-brand">
        <p>InterviewAI</p>
        <span>AI-Powered Success</span>
      </div>

      <nav className="app-sidebar-nav" aria-label="Main navigation">
        {menuItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `app-sidebar-link ${isActive ? "app-sidebar-link-active" : ""}`
            }
            key={item.label}
            onClick={onClose}
            to={item.path}
          >
            <img src={item.icon} alt="" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar-footer">
        <a className="app-sidebar-support" href="#support">
          <img src={helpIcon} alt="" aria-hidden="true" />
          <span>Hỗ trợ</span>
        </a>
        {/* <button
          className="app-sidebar-logout"
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          <img src={logoutIcon} alt="" aria-hidden="true" />
          <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
        </button> */}
        <button
          className="app-sidebar-user"
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          <img src={profileIcon} alt="" aria-hidden="true" />
          <div>
            <strong>{account?.fullname || "Người dùng"}</strong>
            <span>{account?.email || "Tài khoản"}</span>
          </div>
          <img src={logoutIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

export default LeftSidebar;
