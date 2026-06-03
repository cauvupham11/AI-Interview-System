import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import backendIcon from "../../../assets/icons/backend.svg";
import codeIcon from "../../../assets/icons/code-nodes.svg";
import downloadIcon from "../../../assets/icons/download.svg";
import eyeIcon from "../../../assets/icons/eye.svg";
import frontendIcon from "../../../assets/icons/frontend.svg";
import fullstackIcon from "../../../assets/icons/fullstack.svg";
import searchIcon from "../../../assets/icons/search.svg";
import { ROUTES } from "../../../shared/constants/routes";
import { getInterviewHistory } from "../services/history.service";
import "../styles/history.css";

const iconMap = {
  backend: backendIcon,
  database: codeIcon,
  frontend: frontendIcon,
  fullstack: fullstackIcon,
};

function InterviewHistoryPage() {
  const [items, setItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [positionFilter, setPositionFilter] = useState("Tất cả");
  const [techFilter, setTechFilter] = useState("Tất cả");

  useEffect(() => {
    getInterviewHistory().then(setItems);
  }, []);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchKeyword = item.title.toLowerCase().includes(keyword.toLowerCase());
        const matchPosition = positionFilter === "Tất cả" || item.title.includes(positionFilter);
        const matchTech = techFilter === "Tất cả" || item.title.includes(techFilter);
        return matchKeyword && matchPosition && matchTech;
      }),
    [items, keyword, positionFilter, techFilter],
  );

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>Lịch sử phỏng vấn</h1>
        <p>
          Xem lại quá trình luyện tập và sự tiến bộ của bạn qua các buổi phỏng vấn giả
          định với AI.
        </p>
      </header>

      <section className="history-filter-card">
        <label className="history-search">
          <img src={searchIcon} alt="" aria-hidden="true" />
          <input
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm kiếm buổi phỏng vấn..."
            value={keyword}
          />
        </label>

        <label className="history-filter">
          <span>Vị trí:</span>
          <select value={positionFilter} onChange={(event) => setPositionFilter(event.target.value)}>
            <option>Tất cả</option>
            <option>Backend</option>
            <option>Frontend</option>
            <option>Fullstack</option>
            <option>Data</option>
          </select>
        </label>

        <label className="history-filter">
          <span>Công nghệ:</span>
          <select value={techFilter} onChange={(event) => setTechFilter(event.target.value)}>
            <option>Tất cả</option>
            <option>NodeJS</option>
            <option>React</option>
            <option>MERN</option>
            <option>Python</option>
          </select>
        </label>

        <label className="history-filter">
          <span>Sắp xếp:</span>
          <select defaultValue="Mới nhất">
            <option>Mới nhất</option>
            <option>Điểm cao nhất</option>
            <option>Điểm thấp nhất</option>
          </select>
        </label>
      </section>

      <section className="history-card-grid">
        {filteredItems.map((item) => (
          <article className="history-card" key={item.id}>
            <div className="history-card-top">
              <span className="history-card-icon">
                <img src={iconMap[item.iconType]} alt="" aria-hidden="true" />
              </span>
              <div>
                <h2>{item.title}</h2>
                <time>{item.date}</time>
              </div>
              <span className="history-status">{item.status}</span>
            </div>

            <div className="history-meta-grid">
              <div>
                <span>CẤP ĐỘ</span>
                <strong>{item.level}</strong>
              </div>
              <div>
                <span>ĐỘ KHÓ</span>
                <strong>{item.difficulty}</strong>
              </div>
              <div>
                <span>CÂU HỎI</span>
                <strong>{item.questionCount}</strong>
              </div>
            </div>

            <div className="history-score-row">
              <span className="history-score-circle">{item.score}</span>
              <div>
                <span>Trung điểm</span>
                <strong>{item.totalScore}</strong>
              </div>
              <div>
                <span>Luyện</span>
                <strong>{item.attempts} lần</strong>
              </div>
              <Link className="history-result-button" to={ROUTES.historyResultById(item.id)}>
                <img src={eyeIcon} alt="" aria-hidden="true" />
                Xem kết quả
              </Link>
            </div>
          </article>
        ))}
      </section>

      <div className="history-download-row">
        <button className="history-download-button" type="button">
          Tải thêm lịch sử
          <img src={downloadIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default InterviewHistoryPage;
