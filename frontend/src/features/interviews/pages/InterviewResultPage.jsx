import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import checkIcon from "../../../assets/icons/check-dot.svg";
import pinIcon from "../../../assets/icons/pin.svg";
import refreshIcon from "../../../assets/icons/refresh.svg";
import warningIcon from "../../../assets/icons/warning.svg";
import { ROUTES } from "../../../shared/constants/routes";
import { getInterviewResult } from "../../history/services/history.service";
import "../../history/styles/history.css";

function ScoreCircle({ score }) {
  return (
    <div className="result-score-circle" style={{ "--score": `${score}%` }}>
      <div>
        <strong>{score}</strong>
        <span>/ 100</span>
      </div>
    </div>
  );
}

function InterviewResultPage() {
  const { interviewId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!interviewId) return;
    getInterviewResult(interviewId).then(setResult).catch(() => setError("Không thể tải kết quả phỏng vấn."));
  }, [interviewId]);

  if (!interviewId) {
    return <Navigate to={ROUTES.history} replace />;
  }

  if (error) {
    return <div className="history-page">{error}</div>;
  }

  if (!result) {
    return <div className="history-page">Đang tải kết quả...</div>;
  }

  return (
    <div className="result-page">
      <header className="result-header">
        <div>
          <h1>{result.title}</h1>
          <p>{result.subtitle}</p>
        </div>
        <div className="result-header-actions">
          <button type="button">Lưu kết quả</button>
          <Link to={ROUTES.interviewSetup}>Luyện lại</Link>
        </div>
      </header>

      <section className="result-top-grid">
        <article className="result-total-card">
          <p>TỔNG ĐIỂM ĐÁNH GIÁ</p>
          <ScoreCircle score={result.totalScore} />
          <span className="performance-badge">{result.performanceLabel}</span>
          <small>{result.performanceNote}</small>
        </article>

        <article className="component-score-card">
          <h2>Chỉ số thành phần</h2>
          <div className="component-score-grid">
            {result.componentScores.map((item) => (
              <div className="component-score-item" key={item.label}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div className="component-score-track">
                  <span style={{ width: `${item.value}%` }} />
                </div>
                <p>{item.note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="result-insight-grid">
        <article className="result-insight-card">
          <h2>
            <img src={checkIcon} alt="" aria-hidden="true" />
            Điểm mạnh
          </h2>
          <ul>
            {result.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="result-insight-card">
          <h2>
            <img src={warningIcon} alt="" aria-hidden="true" />
            Điểm yếu
          </h2>
          <ul>
            {result.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="result-insight-card">
          <h2>
            <img src={pinIcon} alt="" aria-hidden="true" />
            Lời khuyên
          </h2>
          <p>{result.advice}</p>
          <Link className="ai-detail-link" to={ROUTES.historyDetailById(interviewId)}>
            Xem chi tiết phân tích AI →
          </Link>
        </article>
      </section>

      <footer className="result-footer-actions">
        <Link className="secondary-action-button" to={ROUTES.historyDetailById(interviewId)}>
          <img src={checkIcon} alt="" aria-hidden="true" />
          Xem chi tiết buổi quay
        </Link>
        <Link className="primary-action-button" to={ROUTES.interviewSetup}>
          <img src={refreshIcon} alt="" aria-hidden="true" />
          Luyện lại ngay
        </Link>
      </footer>
    </div>
  );
}

export default InterviewResultPage;
