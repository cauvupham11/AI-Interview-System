import clockIcon from "../../../assets/icons/clock.svg";
import scoreIcon from "../../../assets/icons/score.svg";

function ProgressPanel({ onFinish, session }) {
  const percentage = Math.round((session.progress.current / session.progress.total) * 100);

  return (
    <aside className="room-progress-panel">
      <p className="progress-title">TIẾN ĐỘ PHỎNG VẤN</p>

      <div className="progress-ring" style={{ "--progress": `${percentage}%` }}>
        <div>
          <strong>
            {session.progress.current}/{session.progress.total}
          </strong>
          <span>CÂU HỎI</span>
        </div>
      </div>

      <div className="progress-stat-card">
        <div>
          <img src={clockIcon} alt="" aria-hidden="true" />
          <span>Thời gian</span>
        </div>
        <strong>{session.elapsedTime}</strong>
      </div>

      <div className="progress-stat-card">
        <div>
          <img src={scoreIcon} alt="" aria-hidden="true" />
          <span>Điểm hiện tại</span>
        </div>
        <strong>{session.estimatedScore}/100</strong>
      </div>

      <section className="skill-section">
        <h2>KỸ NĂNG ĐÁNH GIÁ</h2>
        <div className="skill-list">
          {session.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="recording-status">
        <span />
        <div>
          <strong>{session.status.title}</strong>
          <p>{session.status.description}</p>
        </div>
      </section>

      <button className="finish-interview-button" onClick={onFinish} type="button">
        Hoàn tất phỏng vấn
      </button>
      <p className="powered-by">POWERED BY INTERVIEWAI ENGINE</p>
    </aside>
  );
}

export default ProgressPanel;
