import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import frontendIcon from "../../../assets/icons/frontend.svg";
import backendIcon from "../../../assets/icons/backend.svg";
import fullstackIcon from "../../../assets/icons/fullstack.svg";
import uploadFileIcon from "../../../assets/icons/upload-file.svg";
import lightningIcon from "../../../assets/icons/lightning.svg";
import { getApiErrorMessage } from "../../auth/services/auth.service";
import { ROUTES } from "../../../shared/constants/routes";
import {
  createCvInterviewSession,
  createInterviewSession,
  createJdInterviewSession,
  getInterviewOptions,
} from "../services/interviewRoom.service";
import "./interview-setup.css";

const positionMeta = {
  Frontend: {
    icon: frontendIcon,
    description: "Thiết kế giao diện và trải nghiệm người dùng với các framework hiện đại.",
  },
  Backend: {
    icon: backendIcon,
    description: "Xử lý logic nghiệp vụ, cơ sở dữ liệu và hệ thống API hiệu năng cao.",
  },
  Fullstack: {
    icon: fullstackIcon,
    description: "Làm chủ cả Frontend và Backend để xây dựng ứng dụng toàn diện.",
  },
};

const fallbackOptions = {
  positions: ["Frontend", "Backend", "Fullstack"],
  technologies: ["React", "NodeJS", "Java", "Vue", "MySQL"],
  levels: ["Fresher", "Junior", "Middle", "Senior"],
  difficulties: ["easy", "medium", "hard"],
  questionCounts: [5, 10, 15],
  interviewLanguages: ["vi", "en"],
};

const interviewLanguages = [
  { label: "Tiếng Việt", value: "vi" },
  { label: "English", value: "en" },
];

function OptionButton({ active, children, onClick }) {
  return (
    <button
      className={`setup-option-button ${active ? "setup-option-button-active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function InterviewSetupPage() {
  const navigate = useNavigate();
  const [options, setOptions] = useState(fallbackOptions);
  const [selectedPosition, setSelectedPosition] = useState(fallbackOptions.positions[0]);
  const [selectedTech, setSelectedTech] = useState(fallbackOptions.technologies[0]);
  const [selectedLevel, setSelectedLevel] = useState(fallbackOptions.levels[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(fallbackOptions.difficulties[1]);
  const [selectedCount, setSelectedCount] = useState(fallbackOptions.questionCounts[0]);
  const [selectedLanguage, setSelectedLanguage] = useState("vi");
  const [uploadMode, setUploadMode] = useState("manual");
  const [cvFile, setCvFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let mounted = true;

    getInterviewOptions()
      .then((data) => {
        if (!mounted) return;

        setOptions(data);
        setSelectedPosition(data.positions[0]);
        setSelectedTech(data.technologies[0]);
        setSelectedLevel(data.levels[0]);
        setSelectedDifficulty(data.difficulties[1] || data.difficulties[0]);
        setSelectedCount(data.questionCounts[0]);
      })
      .catch((apiError) => {
        if (mounted) {
          setError(getApiErrorMessage(apiError, "Không thể tải tùy chọn phỏng vấn."));
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const positions = useMemo(
    () =>
      options.positions.map((position) => ({
        ...(positionMeta[position] || positionMeta.Fullstack),
        id: position,
        title: position,
      })),
    [options.positions],
  );

  const resetSelection = () => {
    setSelectedPosition(options.positions[0]);
    setSelectedTech(options.technologies[0]);
    setSelectedLevel(options.levels[0]);
    setSelectedDifficulty(options.difficulties[1] || options.difficulties[0]);
    setSelectedCount(options.questionCounts[0]);
    setSelectedLanguage("vi");
    setUploadMode("manual");
    setCvFile(null);
    setJdText("");
    setError("");
  };

  const startInterview = async () => {
    setError("");
    let debugPayload = null;

    try {
      setIsStarting(true);
      let data;

      if (uploadMode === "cv") {
        if (!cvFile) {
          setError("Vui lòng chọn file CV PDF.");
          return;
        }

        debugPayload = {
          mode: "cv",
          fileName: cvFile.name,
          interviewLanguage: selectedLanguage,
        };
        data = await createCvInterviewSession(cvFile, selectedLanguage);
      } else if (uploadMode === "jd") {
        if (!jdText.trim()) {
          setError("Vui lòng dán nội dung JD.");
          return;
        }

        debugPayload = {
          mode: "jd",
          jdLength: jdText.trim().length,
          interviewLanguage: selectedLanguage,
        };
        data = await createJdInterviewSession(jdText, selectedLanguage);
      } else {
        const payload = {
          position: selectedPosition,
          technology: selectedTech,
          level: selectedLevel,
          difficulty: selectedDifficulty,
          questionCount: selectedCount,
          interviewLanguage: selectedLanguage,
        };

        debugPayload = {
          mode: "manual",
          ...payload,
        };
        data = await createInterviewSession(payload);
      }

      if (!data?.session?.id) {
        throw new Error("Backend không trả về session id.");
      }

      navigate(ROUTES.interviewRoomById(data.session.id));
    } catch (apiError) {
      const message = getApiErrorMessage(apiError, "Không thể tạo buổi phỏng vấn.");
      console.error("Create interview failed", {
        message,
        status: apiError.response?.status,
        response: apiError.response?.data,
        payload: debugPayload,
      });
      setError(message);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="interview-setup-page">
      <header className="setup-header">
        <h1>Bạn muốn luyện phỏng vấn vị trí nào?</h1>
        <p>Chọn vị trí, công nghệ và độ khó để AI tạo buổi phỏng vấn phù hợp.</p>
      </header>

      {error ? <p className="setup-error">{error}</p> : null}

      <section className="setup-section">
        <h2>1. Chọn vị trí</h2>
        <div className="position-grid">
          {positions.map((position) => (
            <button
              className={`position-card ${
                selectedPosition === position.id ? "position-card-active" : ""
              }`}
              key={position.id}
              onClick={() => setSelectedPosition(position.id)}
              type="button"
            >
              <img src={position.icon} alt="" aria-hidden="true" />
              <h3>{position.title}</h3>
              <p>{position.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h2>2. Chọn công nghệ</h2>
        <div className="tech-list">
          {options.technologies.map((tech) => (
            <OptionButton active={selectedTech === tech} key={tech} onClick={() => setSelectedTech(tech)}>
              {tech}
            </OptionButton>
          ))}
        </div>
      </section>

      <section className="setup-grid-two">
        <div className="setup-section">
          <h2>3. Chọn level</h2>
          <div className="segmented-control">
            {options.levels.map((level) => (
              <OptionButton
                active={selectedLevel === level}
                key={level}
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </OptionButton>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <h2>4. Chọn độ khó</h2>
          <div className="difficulty-list">
            {options.difficulties.map((difficulty) => (
              <OptionButton
                active={selectedDifficulty === difficulty}
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </OptionButton>
            ))}
          </div>
        </div>
      </section>

      <section className="setup-section">
        <h2>5. Chọn số câu hỏi</h2>
        <div className="question-count-list">
          {options.questionCounts.map((count) => (
            <OptionButton active={selectedCount === count} key={count} onClick={() => setSelectedCount(count)}>
              {count} câu
            </OptionButton>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h2>6. Chọn ngôn ngữ phỏng vấn</h2>
        <div className="language-list">
          {interviewLanguages.map((language) => (
            <OptionButton
              active={selectedLanguage === language.value}
              key={language.value}
              onClick={() => setSelectedLanguage(language.value)}
            >
              {language.label}
            </OptionButton>
          ))}
        </div>
      </section>

      <section className="setup-section">
        <h2>7. Kiểu tạo buổi phỏng vấn</h2>
        <div className="upload-card">
          <div className="upload-tabs">
            <button
              className={uploadMode === "manual" ? "upload-tab-active" : ""}
              onClick={() => setUploadMode("manual")}
              type="button"
            >
              Theo lựa chọn
            </button>
            <button
              className={uploadMode === "cv" ? "upload-tab-active" : ""}
              onClick={() => setUploadMode("cv")}
              type="button"
            >
              Upload CV
            </button>
            <button
              className={uploadMode === "jd" ? "upload-tab-active" : ""}
              onClick={() => setUploadMode("jd")}
              type="button"
            >
              Dán JD
            </button>
          </div>

          {uploadMode === "cv" ? (
            <label className="upload-dropzone">
              <input
                accept="application/pdf,.pdf"
                onChange={(event) => setCvFile(event.target.files?.[0] || null)}
                type="file"
              />
              <span className="upload-icon-circle">
                <img src={uploadFileIcon} alt="" aria-hidden="true" />
              </span>
              <strong>{cvFile ? cvFile.name : "Kéo thả file CV hoặc chọn file PDF"}</strong>
              <small>Backend hiện nhận file PDF tối đa 10MB.</small>
            </label>
          ) : null}

          {uploadMode === "jd" ? (
            <textarea
              className="jd-textarea"
              onChange={(event) => setJdText(event.target.value)}
              placeholder="Dán nội dung job description tại đây..."
              value={jdText}
            />
          ) : null}

          {uploadMode === "manual" ? (
            <p className="manual-mode-note">
              AI sẽ tạo câu hỏi theo vị trí, công nghệ, level, độ khó và ngôn ngữ bạn đã chọn.
            </p>
          ) : null}
        </div>
      </section>

      <footer className="setup-actions">
        {error ? <p className="setup-action-error">{error}</p> : null}
        <button className="start-interview-button" disabled={isStarting} onClick={startInterview} type="button">
          <img src={lightningIcon} alt="" aria-hidden="true" />
          {isStarting ? "Đang tạo phỏng vấn..." : "Bắt đầu phỏng vấn"}
        </button>
        <button className="reset-selection-button" disabled={isStarting} onClick={resetSelection} type="button">
          Reset lựa chọn
        </button>
      </footer>
    </div>
  );
}

export default InterviewSetupPage;
