import { useLocation } from "react-router-dom";
import bellIcon from "../../../assets/icons/bell.svg";
import moonIcon from "../../../assets/icons/moon.svg";
import profileIcon from "../../../assets/icons/profile.svg";
import { ROUTES } from "../../constants/routes";

const breadcrumbs = {
  [ROUTES.dashboard]: ["Tổng quan"],
  [ROUTES.interviewSetup]: ["Tổng quan", "Thiết lập phỏng vấn"],
  [ROUTES.interviewRoom]: ["Tổng quan", "Phòng phỏng vấn"],
  [ROUTES.interviewResult]: ["Tổng quan", "Kết quả phỏng vấn"],
  [ROUTES.history]: ["Tổng quan", "Lịch sử phỏng vấn"],
};

function getBreadcrumbs(pathname) {
  if (pathname.startsWith("/history/") && pathname.endsWith("/result")) {
    return ["Lịch sử phỏng vấn", "Kết quả phỏng vấn"];
  }

  if (pathname.startsWith("/history/") && pathname.endsWith("/detail")) {
    return ["Lịch sử phỏng vấn", "Chi tiết buổi phỏng vấn"];
  }

  return breadcrumbs[pathname] || ["Tổng quan"];
}

function Topbar() {
  const { pathname } = useLocation();
  const activeBreadcrumb = getBreadcrumbs(pathname);

  return (
    <header className="app-topbar">
      <div className="app-breadcrumb">
        {activeBreadcrumb.map((item, index) => (
          <span key={item}>
            {index > 0 ? <span className="app-breadcrumb-separator">/</span> : null}
            {item}
          </span>
        ))}
      </div>

      <div className="app-topbar-actions">
        <button className="app-icon-button" type="button" aria-label="Thông báo">
          <img src={bellIcon} alt="" aria-hidden="true" />
        </button>
        <button className="app-icon-button" type="button" aria-label="Đổi giao diện">
          <img src={moonIcon} alt="" aria-hidden="true" />
        </button>
        <button className="app-profile-button" type="button" aria-label="Tài khoản">
          <img src={profileIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
