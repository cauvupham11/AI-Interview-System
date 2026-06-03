# AI Interview System

## Giới thiệu

AI Interview System là website mô phỏng phỏng vấn với AI, giúp người dùng luyện tập phỏng vấn kỹ thuật theo vị trí, công nghệ, cấp độ và ngôn ngữ mong muốn.

Người dùng có thể:

- Đăng ký, đăng nhập và quản lý phiên đăng nhập.
- Tạo buổi phỏng vấn theo setup thủ công.
- Upload CV PDF để AI phân tích và tạo câu hỏi phù hợp.
- Dán JD để AI tạo bộ câu hỏi theo yêu cầu công việc.
- Trả lời câu hỏi trong phòng phỏng vấn.
- Nhận câu hỏi tiếp theo được sinh bằng AI.
- Nhận feedback, điểm số và tổng kết sau khi hoàn thành phỏng vấn.
- Xem lại lịch sử, kết quả và chi tiết từng buổi phỏng vấn.

## Công nghệ sử dụng

### Frontend

- ReactJS
- Vite
- React Router
- Axios
- CSS theo từng feature
- ESLint

Ghi chú: TailwindCSS đã có cấu hình trong dự án, nhưng giao diện hiện tại chủ yếu dùng CSS thuần theo module/feature. Zustand chưa được sử dụng trong package hiện tại.

### Backend

- NodeJS
- ExpressJS
- MySQL
- TypeORM
- Redis
- JWT Authentication
- bcrypt
- Gemini API

Ghi chú: Socket.IO chưa được tích hợp trong backend hiện tại. Luồng phỏng vấn đang xử lý qua REST API.

## Chức năng chính

### Authentication

- Đăng ký tài khoản.
- Đăng nhập.
- Lưu access token và refresh token.
- Tự động gắn token vào request.
- Refresh token khi access token hết hạn.
- Đăng xuất và xoá phiên đăng nhập.

### Interview Setup

Người dùng có thể chọn:

- Vị trí: Frontend, Backend, Fullstack.
- Công nghệ: React, NodeJS, Java, Vue, MySQL.
- Level: Fresher, Junior, Middle, Senior.
- Độ khó: easy, medium, hard.
- Số câu hỏi: 5, 10, 15.
- Ngôn ngữ phỏng vấn: Tiếng Việt hoặc English.
- Kiểu tạo buổi phỏng vấn:
  - Theo lựa chọn thủ công.
  - Upload CV PDF.
  - Dán JD.

### AI Interview

- Backend tạo phiên phỏng vấn.
- AI sinh câu hỏi dựa trên setup/CV/JD.
- Người dùng trả lời từng câu hỏi.
- Backend lưu câu trả lời.
- AI sinh câu hỏi tiếp theo.
- Khi hoàn thành đủ số câu hỏi, AI chấm điểm và tạo tổng kết.

### Chống trùng câu hỏi

Backend có logic tránh lặp câu hỏi bằng cách đưa vào prompt AI:

- Các câu đã hỏi trong session hiện tại.
- Các câu hỏi từ 10 session gần nhất có cùng setup.

Nhờ vậy, nếu người dùng tạo nhiều buổi phỏng vấn cùng cấu hình, AI sẽ hạn chế sinh lại câu hỏi giống nhau.

### Feedback & Scoring

Sau khi hoàn thành buổi phỏng vấn, hệ thống tạo:

- Điểm tổng.
- Điểm kỹ thuật.
- Điểm giao tiếp.
- Số câu trả lời tốt.
- Số câu trả lời yếu.
- Điểm mạnh.
- Điểm yếu.
- Lời khuyên cải thiện.
- Feedback tổng quan.
- Chi tiết nhận xét từng câu hỏi.

### Interview History

Người dùng có thể xem:

- Danh sách lịch sử phỏng vấn.
- Kết quả từng buổi phỏng vấn.
- Chi tiết câu hỏi, câu trả lời và feedback.
- Thống kê luyện tập.

## Cấu trúc dự án

```text
AI-Interview-System/
  backend/
    app.js
    server.js
    src/
      config/
      controllers/
      entities/
      middlewares/
      routes/
      services/
      utils/

  frontend/
    public/
    src/
      app/
      assets/
      config/
      features/
        auth/
        dashboard/
        history/
        interviews/
      layouts/
      shared/
```

## Cách chạy dự án

### 1. Chuẩn bị

Cần cài đặt:

- Node.js
- MySQL
- Redis
- Gemini API key

### 2. Cấu hình Backend

Tạo file `.env` trong thư mục `backend`.

```env
APP_PORT=8080
APP_HOSTNAME=localhost
DOMAIN_CORS=http://localhost:5173

DATABASE_HOSTNAME=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=ai_interview_system

REDIS_HOSTNAME=localhost
REDIS_PORT=6379

JWT_ACCESS_SECRET=replace_with_access_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

NODE_ENV=development
```

### 3. Chạy Backend

```bash
cd backend
npm install
npm run dev
```

Hoặc chạy trực tiếp:

```bash
cd backend
node server.js
```

Backend mặc định chạy tại:

```text
http://localhost:8080/api
```

### 4. Cấu hình Frontend

Tạo file `.env` trong thư mục `frontend` nếu muốn đổi API URL.

```env
VITE_API_URL=http://localhost:8080/api
```

Nếu không tạo `.env`, frontend mặc định gọi:

```text
http://localhost:8080/api
```

### 5. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

Nếu `npm` trên Windows bị lỗi, có thể chạy trực tiếp:

```bash
cd frontend
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173
```

## API chính

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
```

### Interviews

```http
GET  /api/interviews/options
POST /api/interviews/sessions
POST /api/interviews/cv-sessions
POST /api/interviews/jd-sessions
GET  /api/interviews/sessions/:id
GET  /api/interviews/sessions/:id/summary
POST /api/interviews/sessions/:id/answers
```

### Histories

```http
GET /api/histories
GET /api/histories/stats
GET /api/histories/:id
```

## Timeout và xử lý AI

Các API liên quan đến Gemini có thể mất nhiều thời gian hơn API thông thường.

Frontend đã cấu hình timeout riêng:

- Tạo session thủ công: 90 giây.
- Tạo session CV/JD: 120 giây.
- Submit answer: 120 giây.

Với setup thủ công, backend tạo session trước và sinh câu hỏi đầu tiên trong background để giảm thời gian chờ khi bấm nút bắt đầu.

## Lỗi thường gặp

### `timeout of 15000ms exceeded`

Nguyên nhân thường là API AI mất nhiều thời gian. Kiểm tra:

- Backend có đang chạy không.
- Gemini API key còn quota không.
- Network có ổn định không.
- Frontend có đang chạy bản mới không.

### `Dịch vụ AI đang quá tải hoặc hết quota`

Gemini API key/model đang hết quota hoặc chưa bật billing.

### Tạo session xong nhưng chưa có câu hỏi

Backend đang sinh câu hỏi đầu tiên trong background. Frontend sẽ tự poll session cho tới khi câu hỏi xuất hiện.

### AI sinh câu hỏi bằng tiếng Anh

Kiểm tra mục chọn ngôn ngữ ở trang setup. Chọn `Tiếng Việt` nếu muốn câu hỏi và feedback bằng tiếng Việt.

## Kiểm tra chất lượng code

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

Nếu thư mục `dist` bị khoá trên Windows:

```bash
node node_modules/vite/bin/vite.js build --outDir dist-check --emptyOutDir true
```

### Backend

Hiện backend chưa có test script tự động. Có thể kiểm tra module load:

```bash
cd backend
node -e "require('./app'); require('./src/services/interview.services'); console.log('backend modules loaded')"
```

## Ghi chú phát triển

- Backend hiện dùng REST API, chưa dùng Socket.IO.
- Khi thêm/sửa entity backend, cần restart server để TypeORM sync schema trong môi trường development.
- Khi đổi `VITE_API_URL`, cần restart Vite dev server.
- Không nên sửa response backend tuỳ tiện; frontend service nên map response backend sang dữ liệu UI cần.
- Gemini quota ảnh hưởng trực tiếp tới tốc độ sinh câu hỏi và chấm điểm.
