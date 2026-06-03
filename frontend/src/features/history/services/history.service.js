import { apiClient } from "../../../shared/lib/apiClient";

function unwrap(response) {
  return response.data.data;
}

function formatDate(value) {
  if (!value) return "Chưa có ngày";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function asPercent(score) {
  return Math.round(Number(score || 0) * 10);
}

function splitTextList(value, fallback) {
  if (!value) return fallback;
  return String(value)
    .split(/\n|;|-/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getIconType(position) {
  const normalized = String(position || "").toLowerCase();
  if (normalized.includes("front")) return "frontend";
  if (normalized.includes("full")) return "fullstack";
  return "backend";
}

export function mapHistoryItem(item) {
  return {
    id: item.id,
    sessionId: item.sessionId,
    iconType: getIconType(item.position),
    title: `${item.position} - ${item.technology}`,
    date: formatDate(item.createdAt),
    status: "Đã hoàn tất",
    level: item.level,
    difficulty: item.session?.difficulty || "adaptive",
    questionCount: `${item.answeredQuestions || item.totalQuestions}/${item.totalQuestions}`,
    score: asPercent(item.averageScore),
    totalScore: `${asPercent(item.averageScore)}/100`,
    attempts: 1,
    raw: item,
  };
}

export function mapInterviewResult(item) {
  const score = asPercent(item.averageScore);

  return {
    id: item.id,
    title: `${item.position} - ${item.technology}`,
    subtitle: `Hoàn thành ${item.answeredQuestions || item.totalQuestions}/${item.totalQuestions} câu hỏi`,
    totalScore: score,
    performanceLabel: score >= 80 ? "Tốt" : score >= 60 ? "Khá" : "Cần cải thiện",
    performanceNote: item.note || "AI đã tổng hợp kết quả phỏng vấn của bạn.",
    componentScores: [
      {
        label: "Kỹ thuật",
        value: asPercent(item.technicalScore),
        note: "Độ chính xác và chiều sâu chuyên môn.",
      },
      {
        label: "Giao tiếp",
        value: asPercent(item.communicationScore),
        note: "Cách trình bày, cấu trúc và độ rõ ràng.",
      },
      {
        label: "Câu tốt",
        value: item.totalQuestions ? Math.round((item.goodAnswerCount / item.totalQuestions) * 100) : 0,
        note: "Tỷ lệ câu trả lời đạt mức tốt.",
      },
      {
        label: "Cần cải thiện",
        value: item.totalQuestions ? Math.round((item.weakAnswerCount / item.totalQuestions) * 100) : 0,
        note: "Tỷ lệ câu trả lời còn yếu.",
      },
    ],
    strengths: splitTextList(item.strengths, ["Chưa có dữ liệu điểm mạnh từ AI."]),
    weaknesses: splitTextList(item.weaknesses, ["Chưa có dữ liệu điểm yếu từ AI."]),
    advice: item.improvementAdvice || item.note || "Hãy luyện thêm các câu trả lời có cấu trúc rõ ràng.",
  };
}

export function mapInterviewDetail(item) {
  const questions = item.session?.questions || [];

  return {
    id: item.id,
    position: item.position,
    level: item.level,
    technology: item.technology,
    date: formatDate(item.createdAt),
    totalScore: `${asPercent(item.averageScore)}/100`,
    duration: "Không có dữ liệu",
    questionCount: item.totalQuestions,
    questions: questions.map((question) => {
      const feedback = question.answer?.feedback;

      return {
        id: question.id,
        question: question.questionText,
        answer: question.answer?.answerText || "",
        score: feedback?.score,
        feedback: feedback?.feedback || feedback?.comment || "Chưa có nhận xét.",
        missing: feedback?.missing || feedback?.missingPoints || "Chưa có dữ liệu thiếu sót.",
        sampleAnswer: feedback?.suggestedAnswer || "Chưa có câu trả lời mẫu.",
        followUp: feedback?.followUpQuestion || "Không có câu hỏi follow-up.",
      };
    }),
  };
}

export async function getInterviewHistory() {
  const response = await apiClient.get("/histories");
  return unwrap(response).map(mapHistoryItem);
}

export async function getHistoryStats() {
  const response = await apiClient.get("/histories/stats");
  return unwrap(response);
}

export async function getInterviewResult(interviewId) {
  const response = await apiClient.get(`/histories/${interviewId}`);
  return mapInterviewResult(unwrap(response));
}

export async function getInterviewDetail(interviewId) {
  const response = await apiClient.get(`/histories/${interviewId}`);
  return mapInterviewDetail(unwrap(response));
}
