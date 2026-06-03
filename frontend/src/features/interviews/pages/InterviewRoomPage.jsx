import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ChatComposer from "../components/ChatComposer";
import ChatMessage from "../components/ChatMessage";
import ProgressPanel from "../components/ProgressPanel";
import RoomHeader from "../components/RoomHeader";
import { getApiErrorMessage } from "../../auth/services/auth.service";
import { ROUTES } from "../../../shared/constants/routes";
import {
  findCurrentQuestion,
  getInterviewSession,
  submitInterviewAnswer,
  toChatMessages,
  toRoomSession,
} from "../services/interviewRoom.service";
import "./interview-room.css";

const FIRST_QUESTION_POLL_INTERVAL = 2000;
const FIRST_QUESTION_MAX_POLLS = 45;

function InterviewRoomPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const startedAtRef = useRef(null);
  const [answer, setAnswer] = useState("");
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPreparingQuestion, setIsPreparingQuestion] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return undefined;

    let mounted = true;
    let timerId;
    let pollCount = 0;

    const loadSession = async () => {
      try {
        const data = await getInterviewSession(sessionId);
        if (!mounted) return;

        const answered = (data.questions || []).filter((question) => question.answer).length;
        const question = findCurrentQuestion(data);

        setSession(data);
        setMessages(toChatMessages(data));
        setCurrentQuestion(question);
        setAnsweredCount(answered);
        setError("");

        if (question) {
          setIsPreparingQuestion(false);
          startedAtRef.current = Date.now();
          return;
        }

        if (data.status === "in_progress" && pollCount < FIRST_QUESTION_MAX_POLLS) {
          pollCount += 1;
          setIsPreparingQuestion(true);
          timerId = window.setTimeout(loadSession, FIRST_QUESTION_POLL_INTERVAL);
          return;
        }

        setIsPreparingQuestion(false);
        setError("AI chưa tạo được câu hỏi đầu tiên. Vui lòng thử tạo lại buổi phỏng vấn.");
      } catch (apiError) {
        if (mounted) {
          setIsPreparingQuestion(false);
          setError(getApiErrorMessage(apiError, "Không thể tải phòng phỏng vấn."));
        }
      }
    };

    loadSession();

    return () => {
      mounted = false;
      window.clearTimeout(timerId);
    };
  }, [sessionId]);

  const roomSession = useMemo(() => {
    if (!session) return null;
    return toRoomSession(session, answeredCount);
  }, [answeredCount, session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!answer.trim() || !currentQuestion || isAnalyzing) return;

    const answerText = answer.trim();
    const startedAt = startedAtRef.current || Date.now();
    const timeSpent = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

    setMessages((current) => [
      ...current,
      {
        id: `candidate-${Date.now()}`,
        role: "candidate",
        time: "",
        content: answerText,
      },
    ]);
    setAnswer("");
    setIsAnalyzing(true);
    setError("");

    try {
      const data = await submitInterviewAnswer(sessionId, {
        questionId: currentQuestion.id,
        answerText,
        timeSpent,
      });

      setAnsweredCount(data.answeredCount);

      if (data.isCompleted) {
        const historyId = data.evaluation?.history?.id;
        navigate(historyId ? ROUTES.historyResultById(historyId) : ROUTES.history);
        return;
      }

      if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        startedAtRef.current = Date.now();
        setMessages((current) => [
          ...current,
          {
            id: `question-${data.nextQuestion.id}`,
            questionId: data.nextQuestion.id,
            role: "ai",
            time: "",
            content: data.nextQuestion.questionText,
          },
        ]);
      }
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, "Không thể gửi câu trả lời."));
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!sessionId) {
    return <Navigate to={ROUTES.interviewSetup} replace />;
  }

  if (error && !session) {
    return <div className="room-loading">{error}</div>;
  }

  if (!roomSession) {
    return <div className="room-loading">Đang tải phòng phỏng vấn...</div>;
  }

  return (
    <div className="interview-room-page">
      <section className="room-chat-panel">
        <RoomHeader onEnd={() => navigate(ROUTES.interviewSetup)} session={roomSession} />

        <div className="room-chat-scroll">
          <div className="room-message-list">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isPreparingQuestion ? (
              <ChatMessage
                message={{
                  id: "ai-preparing-question",
                  role: "ai",
                  time: "",
                  content: "AI đang chuẩn bị câu hỏi đầu tiên, bạn chờ một chút nhé...",
                }}
              />
            ) : null}

            {isAnalyzing ? (
              <ChatMessage
                message={{
                  id: "ai-thinking",
                  role: "ai",
                  time: "",
                  content: "AI đang phân tích câu trả lời và tạo câu hỏi tiếp theo...",
                }}
              />
            ) : null}

            {error ? <p className="room-error">{error}</p> : null}
          </div>
        </div>

        <ChatComposer
          disabled={isAnalyzing || isPreparingQuestion || !currentQuestion}
          onChange={setAnswer}
          onSubmit={handleSubmit}
          value={answer}
        />
      </section>

      <ProgressPanel onFinish={() => navigate(ROUTES.interviewSetup)} session={roomSession} />
    </div>
  );
}

export default InterviewRoomPage;
