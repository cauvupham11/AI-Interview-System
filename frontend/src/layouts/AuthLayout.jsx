import { Outlet } from "react-router-dom";
import registerPreviewImage from "../assets/image.png";
import "../features/auth/styles/auth.css";

const registerFeatures = [
  {
    icon: "AI",
    title: "Phân tích chuyên sâu bởi AI",
    description:
      "Hệ thống AI tiên tiến đánh giá ngôn ngữ cơ thể, giọng nói và nội dung câu trả lời của bạn trong thời gian thực.",
  },
  {
    icon: "▣",
    title: "Phỏng vấn giả lập thực tế",
    description:
      "Trải nghiệm môi trường phỏng vấn chuyên nghiệp với hàng ngàn kịch bản từ các tập đoàn hàng đầu thế giới.",
  },
  {
    icon: "↗",
    title: "Lộ trình thăng tiến cá nhân",
    description:
      "Theo dõi sự tiến bộ của bạn qua từng buổi tập và nhận gợi ý cải thiện kỹ năng giao tiếp một cách khoa học.",
  },
];

function AuthLayout() {
  return (
    <main className="auth-page">
      <div className="auth-shell register-auth-shell">
        <section className="register-left-panel">
          <div className="register-left-content">
            <div className="register-brand-row">
              <span className="login-brand-mark">✹</span>
              <span className="register-brand">InterviewAI</span>
            </div>

            <div className="register-feature-list">
              {registerFeatures.map((item) => (
                <div key={item.title} className="register-feature">
                  <div className="register-feature-icon">{item.icon}</div>
                  <div>
                    <h2 className="register-feature-title">{item.title}</h2>
                    <p className="register-feature-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="register-preview-card">
              <img
                className="register-preview-image"
                src={registerPreviewImage}
                alt="AI interview analytics dashboard"
              />

              <div className="register-preview-footer">
                <p className="register-score">AI Score: 98/100</p>
                <div className="register-avatar-stack">
                  <span className="register-avatar">HR</span>
                  <span className="register-avatar register-avatar-purple">CEO</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="register-form-panel">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
