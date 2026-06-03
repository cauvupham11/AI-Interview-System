import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import botIcon from "../../../assets/icons/bot.svg";
import checkIcon from "../../../assets/icons/check-dot.svg";
import pdfIcon from "../../../assets/icons/pdf.svg";
import profileIcon from "../../../assets/icons/profile.svg";
import refreshIcon from "../../../assets/icons/refresh.svg";
import warningIcon from "../../../assets/icons/warning.svg";
import { ROUTES } from "../../../shared/constants/routes";
import { getInterviewDetail } from "../services/history.service";
import "../styles/history.css";

function QuestionReview({ item, index }) {
  return (
    <article className="detail-question-block">
      <div className="detail-timeline-icon">
        <img src={index === 0 ? botIcon : checkIcon} alt="" aria-hidden="true" />
      </div>

      <div className="detail-question-content">
        <div className="detail-ai-question">{item.question}</div>

        {item.answer ? (
          <div className="detail-user-answer">
            <p>{item.answer}</p>
            <img src={profileIcon} alt="" aria-hidden="true" />
          </div>
        ) : null}

        {item.score ? (
          <section className="detail-feedback-panel">
            <header>
              <span>Đánh giá từ AI</span>
              <strong>{item.score}/10</strong>
            </header>

            <div className="detail-feedback-grid">
              <div>
                <h3>Nhận xét</h3>
                <p>{item.feedback}</p>

                <h3 className="detail-warning-title">
                  <img src={warningIcon} alt="" aria-hidden="true" />
                  Thiếu sót
                </h3>
                <p>{item.missing}</p>
              </div>

              <aside>
                <h3>Câu trả lời mẫu</h3>
                <p>{item.sampleAnswer}</p>
                <button type="button">Sao chép toàn bộ</button>
                <h3>Follow-up question:</h3>
                <p>{item.followUp}</p>
              </aside>
            </div>

            <footer>
              <button type="button">Luyện lại câu này</button>
              <button type="button">Tiếp tục xem</button>
            </footer>
          </section>
        ) : (
          <button className="detail-locked-note" type="button">
            Nhấn vào để xem chi tiết nhận xét cho câu hỏi này
          </button>
        )}
      </div>
    </article>
  );
}

function InterviewDetailPage() {
  const { interviewId } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!interviewId) return;
    getInterviewDetail(interviewId).then(setDetail).catch(() => setError("Không thể tải chi tiết phỏng vấn."));
  }, [interviewId]);

  if (!interviewId) {
    return <Navigate to={ROUTES.history} replace />;
  }

  if (error) {
    return <div className="detail-page">{error}</div>;
  }

  if (!detail) {
    return <div className="detail-page">Đang tải chi tiết buổi phỏng vấn...</div>;
  }

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Link className="back-link" to={ROUTES.history}>
          ← Quay lại
        </Link>
        <h1>Chi tiết buổi phỏng vấn</h1>
        <div className="detail-header-actions">
          <button type="button">
            <img src={pdfIcon} alt="" aria-hidden="true" />
            Xuất báo cáo PDF
          </button>
          <Link to={ROUTES.history}>Quay lại lịch sử</Link>
        </div>
      </header>

      <section className="detail-summary-grid">
        <article className="detail-summary-main">
          <div>
            <span>VỊ TRÍ</span>
            <strong>{detail.position}</strong>
            <small>Cấp độ</small>
            <p>{detail.level}</p>
          </div>
          <div>
            <span>CÔNG NGHỆ</span>
            <p>{detail.technology}</p>
          </div>
        </article>
        <article className="detail-summary-card">
          <span>NGÀY THỰC HIỆN</span>
          <strong>{detail.date}</strong>
        </article>
        <article className="detail-summary-card">
          <span>TỔNG ĐIỂM</span>
          <strong>{detail.totalScore}</strong>
        </article>
      </section>

      <section className="detail-question-list">
        {detail.questions.map((item, index) => (
          <QuestionReview item={item} index={index} key={item.id} />
        ))}
      </section>

      <footer className="detail-bottom-bar">
        <div>
          <span className="detail-mini-avatar">AI</span>
          <span className="detail-mini-avatar detail-mini-avatar-alt">KC</span>
          <p>
            Buổi phỏng vấn kéo dài {detail.duration} · {detail.questionCount} câu hỏi
          </p>
        </div>
        <div>
          <Link className="secondary-action-button" to={ROUTES.history}>
            Quay lại lịch sử
          </Link>
          <Link className="primary-action-button" to={ROUTES.interviewSetup}>
            <img src={refreshIcon} alt="" aria-hidden="true" />
            Bắt đầu luyện tập buổi mới
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default InterviewDetailPage;
