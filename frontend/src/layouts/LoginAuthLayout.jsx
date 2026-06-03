import { Outlet } from "react-router-dom";
import "../features/auth/styles/auth.css";

const loginFeatures = [
  {
    icon: "◎",
    title: "AI tạo câu hỏi theo vị trí",
    description: "Phân tích JD và tạo bộ câu hỏi sát thực tế cho Frontend, Backend, Devops...",
    tone: "blue",
  },
  {
    icon: "▤",
    title: "Chấm điểm và nhận xét tức thì",
    description: "Đánh giá chính xác kiến thức chuyên môn và khả năng diễn đạt của bạn.",
    tone: "cyan",
  },
  {
    icon: "↻",
    title: "Lưu lịch sử luyện tập",
    description: "Theo dõi tiến trình cải thiện kỹ năng qua từng buổi học với biểu đồ trực quan.",
    tone: "pink",
  },
];

function LoginAuthLayout() {
  return (
    <main className="auth-page">
      <div className="auth-shell login-shell">
        <section className="login-left-panel">
          <div className="login-stars" />
          <div className="login-circuit" />

          <div className="login-left-content">
            <div>
              <div className="login-brand-row">
                <span className="login-brand-mark">✹</span>
                <span className="login-brand-text">InterviewAI</span>
              </div>

              <h1 className="login-hero-title">Luyện phỏng vấn IT cùng AI</h1>
              <p className="login-hero-description">
                Tạo câu hỏi, luyện trả lời, nhận chấm điểm và cải thiện kỹ năng phỏng vấn
                thông qua hệ thống trí tuệ nhân tạo tiên tiến nhất.
              </p>
            </div>

            <div className="login-feature-list">
              {loginFeatures.map((item) => (
                <article className="login-feature-card" key={item.title}>
                  <span className={`login-feature-icon login-feature-icon-${item.tone}`}>
                    {item.icon}
                  </span>
                  <div>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="login-form-panel">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

export default LoginAuthLayout;
