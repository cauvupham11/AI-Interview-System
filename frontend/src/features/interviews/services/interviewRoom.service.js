import { apiClient } from "../../../shared/lib/apiClient";

function unwrap(response) {
  return response.data.data;
}

export async function getInterviewOptions() {
  const response = await apiClient.get("/interviews/options");
  return unwrap(response);
}

export async function createInterviewSession(payload) {
  const response = await apiClient.post("/interviews/sessions", payload, {
    timeout: 90000,
  });
  return unwrap(response);
}

export async function createCvInterviewSession(file, interviewLanguage = "vi") {
  const response = await apiClient.post("/interviews/cv-sessions", file, {
    headers: {
      "Content-Type": "application/pdf",
      "X-Interview-Language": interviewLanguage,
    },
    timeout: 120000,
  });

  return unwrap(response);
}

export async function createJdInterviewSession(jdText, interviewLanguage = "vi") {
  const response = await apiClient.post("/interviews/jd-sessions", { jdText, interviewLanguage }, {
    timeout: 120000,
  });
  return unwrap(response);
}

export async function getInterviewSession(sessionId) {
  const response = await apiClient.get(`/interviews/sessions/${sessionId}`);
  return unwrap(response);
}

export async function getInterviewSessionSummary(sessionId) {
  const response = await apiClient.get(`/interviews/sessions/${sessionId}/summary`);
  return unwrap(response);
}

export async function submitInterviewAnswer(sessionId, payload) {
  const response = await apiClient.post(`/interviews/sessions/${sessionId}/answers`, payload, {
    timeout: 120000,
  });
  return unwrap(response);
}

export function toRoomSession(session, answeredCount = 0) {
  return {
    id: session.id,
    title: `${session.position} - ${session.technology}`,
    level: session.level,
    difficulty: session.difficulty,
    interviewLanguage: session.interviewLanguage || "vi",
    elapsedTime: "--:--",
    estimatedScore: Math.round(Number(session.totalScore || 0) * 10),
    skills: [session.position, session.technology, session.level],
    progress: {
      current: answeredCount,
      total: session.questionCount,
    },
    status: {
      title: session.status === "completed" ? "Đã hoàn tất" : "Đang phỏng vấn",
      description:
        session.status === "completed"
          ? "Buổi phỏng vấn đã được chấm điểm."
          : "AI đang tạo câu hỏi dựa trên cấu hình của bạn.",
    },
  };
}

export function toChatMessages(session) {
  const questions = [...(session.questions || [])].sort((left, right) => left.orderIndex - right.orderIndex);
  const messages = [];

  questions.forEach((question) => {
    messages.push({
      id: `question-${question.id}`,
      questionId: question.id,
      role: "ai",
      time: "",
      content: question.questionText,
    });

    if (question.answer) {
      messages.push({
        id: `answer-${question.answer.id}`,
        role: "candidate",
        time: "",
        content: question.answer.answerText,
      });
    }
  });

  return messages;
}

export function findCurrentQuestion(session) {
  const questions = [...(session.questions || [])].sort((left, right) => left.orderIndex - right.orderIndex);
  return questions.find((question) => !question.answer) || questions.at(-1) || null;
}
