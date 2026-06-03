export const interviewHistoryItems = [
  {
    id: "backend-nodejs",
    title: "Backend Developer - NodeJS",
    date: "20/05/2026",
    level: "Senior",
    difficulty: "Khó",
    questionCount: 12,
    score: 78,
    attempts: 1,
    status: "HOÀN THÀNH",
    iconType: "backend",
    totalScore: "78/100",
  },
  {
    id: "frontend-react",
    title: "Frontend Developer - React",
    date: "18/06/2026",
    level: "Middle",
    difficulty: "Vừa",
    questionCount: 10,
    score: 90,
    attempts: 1,
    status: "HOÀN THÀNH",
    iconType: "frontend",
    totalScore: "90/100",
  },
  {
    id: "fullstack-mern",
    title: "Fullstack Engineer - MERN",
    date: "15/05/2026",
    level: "Senior",
    difficulty: "Khó",
    questionCount: 15,
    score: 65,
    attempts: 1,
    status: "HOÀN THÀNH",
    iconType: "fullstack",
    totalScore: "65/100",
  },
  {
    id: "data-python",
    title: "Data Engineer - Python/SQL",
    date: "10/05/2026",
    level: "Junior",
    difficulty: "Dễ",
    questionCount: 8,
    score: 82,
    attempts: 2,
    status: "HOÀN THÀNH",
    iconType: "database",
    totalScore: "82/100",
  },
];

export const interviewResultById = {
  "backend-nodejs": {
    id: "backend-nodejs",
    title: "Kết quả buổi phỏng vấn",
    subtitle: "Phân tích chi tiết từ AI dựa trên hiệu suất thực tế của bạn.",
    totalScore: 78,
    performanceLabel: "Good Performance",
    performanceNote: "Bạn đang ở mức khá tốt so với các ứng viên khác.",
    componentScores: [
      {
        label: "Technical Skill",
        value: 75,
        note: "Nắm vững các khái niệm cơ bản, cần cải thiện kiến trúc hệ thống.",
      },
      {
        label: "Communication",
        value: 80,
        note: "Trình bày mạch lạc, tự tin và có sức thuyết phục.",
      },
      {
        label: "Problem Solving",
        value: 78,
        note: "Hướng giải quyết logic, tốc độ xử lý tình huống ổn định.",
      },
      {
        label: "Confidence",
        value: 70,
        note: "Cần giảm bớt các từ đệm và giữ nhịp thở ổn định hơn.",
      },
    ],
    strengths: [
      "Khả năng giải thích các khái niệm phức tạp một cách đơn giản.",
      "Tư duy phản biện tốt khi đối mặt với các câu hỏi tình huống.",
      "Sử dụng ngôn ngữ cụ thể chuyên nghiệp, thân thiện.",
    ],
    weaknesses: [
      "Còn lúng túng khi được hỏi sâu về kiến thức Cloud Infrastructure.",
      "Tốc độ nói đôi khi quá nhanh khi gặp áp lực về thời gian.",
      "Thiếu ví dụ thực tế cụ thể cho phần Problem Solving.",
    ],
    advice:
      "Hãy tập trung ôn tập thêm về Docker và Kubernetes, đồng thời chuẩn bị ví dụ theo mô hình STAR: Situation, Task, Action, Result để cấu trúc câu trả lời mạch lạc hơn.",
  },
};

export const interviewDetailById = {
  "backend-nodejs": {
    id: "backend-nodejs",
    position: "Senior Frontend Developer",
    technology: "React, Tailwind, Node.js",
    level: "Professional",
    date: "24/10/2023",
    totalScore: "8.5/10",
    candidate: "Phạm Văn Cầu",
    duration: "45 phút",
    questionCount: 12,
    questions: [
      {
        id: "q1",
        question:
          "Bạn hãy giải thích Virtual DOM trong React và tại sao nó lại giúp tối ưu hóa hiệu năng ứng dụng?",
        answer:
          "Virtual DOM là một bản sao nhẹ của DOM thật. Khi state thay đổi, React tạo ra một cây Virtual DOM mới, so sánh với cây cũ qua quá trình diffing và chỉ cập nhật những phần thay đổi thực sự lên DOM thật, giúp tránh việc render lại toàn bộ trang.",
        score: 9,
        feedback:
          "Câu trả lời rất súc tích và nắm bắt đúng trọng tâm của vấn đề. Bạn đã giải thích tốt quy trình diffing và lợi ích của việc cập nhật từng phần.",
        missing:
          "Cần đề cập thêm về Reconciliation và việc React 16+ đã thay đổi cơ chế này như thế nào với Fiber architecture để đạt điểm tối đa.",
        sampleAnswer:
          "Virtual DOM là một abstraction của HTML DOM. Khi có sự thay đổi, React sẽ dựng Virtual DOM mới rồi so sánh với cây cũ qua thuật toán diffing/reconciliation. Quá trình này giúp tối ưu hóa batch updates, giảm thiểu thao tác trực tiếp với DOM thật vốn rất tốn kém về tài nguyên.",
        followUp:
          "Vậy bạn có thể giải thích sự khác biệt giữa Shadow DOM và Virtual DOM không?",
      },
      {
        id: "q2",
        question:
          "Làm thế nào để xử lý bất đồng bộ trong JavaScript và sự khác biệt giữa Promise và Async/Await?",
        answer: "",
        score: null,
        feedback: "",
        missing: "",
        sampleAnswer: "",
        followUp: "",
      },
    ],
  },
};
