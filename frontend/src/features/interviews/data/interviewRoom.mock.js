export const interviewSession = {
  title: "Backend Developer - NodeJS",
  level: "JUNIOR",
  difficulty: "TRUNG BÌNH",
  progress: {
    current: 3,
    total: 10,
  },
  elapsedTime: "12:45",
  estimatedScore: 78,
  skills: ["NodeJS", "TypeScript", "MongoDB", "Redis"],
  status: {
    title: "Đang ghi âm & Phân tích",
    description: "Camera & Mic đang hoạt động",
  },
};

export const interviewMessages = [
  {
    id: "ai-intro",
    role: "ai",
    time: "10:05 AM",
    content:
      "Chào bạn, chúng ta sẽ bắt đầu buổi phỏng vấn hôm nay. Bạn có thể giải thích sự khác biệt giữa process.nextTick() và setImmediate() trong NodeJS không?",
  },
  {
    id: "candidate-answer",
    role: "candidate",
    time: "10:07 AM",
    content:
      "Theo mình biết, process.nextTick() sẽ thực thi callback ngay sau khi thao tác hiện tại kết thúc, trước khi event loop tiếp tục. Còn setImmediate() sẽ đưa callback vào hàng đợi để thực hiện trong vòng lặp tiếp theo của event loop.",
  },
];

export const aiFeedback = {
  score: 7,
  maxScore: 10,
  summary: "Câu trả lời khá chính xác về mặt khái niệm cơ bản nhưng cần thêm ví dụ thực tế.",
  missing:
    "Chưa đề cập đến thứ tự ưu tiên cụ thể trong các phase của Event Loop.",
  suggestion:
    "Hãy nói rõ process.nextTick() thuộc về Microtask queue, ưu tiên cao hơn.",
  followUp: "Vậy việc lạm dụng process.nextTick() có thể gây ra vấn đề gì cho ứng dụng?",
};
