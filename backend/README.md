# AI Interview System - Backend

Backend cung cap API cho he thong phong van AI: dang ky/dang nhap, tao phien phong van, sinh cau hoi bang Gemini, nop cau tra loi, cham diem, tong ket va xem lich su luyen tap.

## Cong nghe

- Node.js
- Express 5
- TypeORM
- MySQL
- Redis
- JWT
- bcrypt
- Google Gemini API (`@google/generative-ai`)

## Cau truc thu muc

```text
backend/
  app.js                         # Cau hinh Express app, CORS, parser, routes, error middleware
  server.js                      # Khoi dong MySQL, Redis va HTTP server
  src/
    config/                      # Bien moi truong, datasource MySQL/Redis
    controllers/                 # Xu ly request/response
    entities/                    # TypeORM EntitySchema
    middlewares/                 # Auth, validate body, rate limit, error handler
    routes/                      # Dinh nghia route
    services/                    # Business logic va AI logic
    utils/                       # JWT/token helpers
```

## Cai dat

```powershell
cd D:\CV-Project\AI-Interview-System\backend
npm install
```

## Bien moi truong

Tao file `.env` trong thu muc `backend`.

```env
APP_PORT=8080
APP_HOSTNAME=localhost
DOMAIN_CORS=http://localhost:5173

DATABASE_HOSTNAME=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=ai_interview_system
DATABASE_SSL=false
DATABASE_SSL_REJECT_UNAUTHORIZED=true

REDIS_HOSTNAME=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_TLS=false
REDIS_URL=

JWT_ACCESS_SECRET=replace_with_access_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

NODE_ENV=development
```

Ghi chu:
- `GEMINI_API_KEY` bat buoc neu muon sinh cau hoi/cham diem bang AI.
- Neu Gemini tra `429 Too Many Requests`, API key/model dang het quota hoac chua co billing.
- Khi dung TiDB Cloud Serverless, dat `DATABASE_SSL=true` vi TiDB bat buoc ket noi qua TLS.
- Khi dung Upstash Redis, vao tab `TCP` va copy URL dang `rediss://default:<token>@<host>:6379` vao `REDIS_URL`. Khong dung `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` cho backend hien tai.
- Khi deploy len Render, them `REDIS_URL` trong phan Environment Variables. Neu khong them, backend se bo qua Redis thay vi ket noi ve `localhost:6379`.
- Tren Render khong dat `REDIS_HOSTNAME=localhost`; neu dung Upstash thi chi can `REDIS_URL`.
- `synchronize` cua TypeORM dang bat khi `NODE_ENV !== production`, nen database schema co the tu dong cap nhat trong moi truong dev.

## Chay server

Chay bang Node:

```powershell
node server.js
```

Chay dev bang nodemon:

```powershell
npm run dev
```

Mac dinh API chay theo `APP_PORT`, vi du:

```text
http://localhost:8080/api
```

Kiem tra nhanh:

```powershell
Invoke-WebRequest http://localhost:8080/api
```

## Luong nghiep vu chinh

1. User dang ky hoac dang nhap.
2. Backend tra ve `account`, `accessToken`, `refreshToken`.
3. Frontend gui `Authorization: Bearer <accessToken>` cho cac API can xac thuc.
4. User tao phien phong van theo 1 trong 3 cach:
   - Theo setup thu cong: vi tri, cong nghe, level, do kho, so cau hoi, ngon ngu.
   - Theo CV PDF.
   - Theo JD text.
5. Backend tao `InterviewSession`.
6. Voi phien phong van thu cong, backend tra session nhanh va tao cau hoi dau tien trong background de giam thoi gian cho.
7. Frontend vao phong phong van va poll session cho toi khi cau hoi dau tien xuat hien.
8. User nop cau tra loi.
9. Backend luu answer va sinh cau tiep theo bang AI.
10. Khi tra loi du so cau, backend cham toan bo cau tra loi, luu feedback, tao/cap nhat practice history.

## Chong trung cau hoi

Khi sinh cau hoi moi, backend truyen vao prompt AI:

- Cac cau hoi da co trong session hien tai.
- Cac cau hoi cua 10 session gan nhat co cung setup:
  - `position`
  - `technology`
  - `level`
  - `difficulty`
  - `questionCount`
  - `interviewType`
  - `interviewLanguage`

Muc tieu la tranh viec Gemini sinh lai cau hoi giong nhau khi user tao nhieu cuoc phong van cung setup.

## Ngon ngu phong van

Session co truong `interviewLanguage`:

- `vi`: cau hoi, feedback, goi y va tong ket bang tieng Viet.
- `en`: cau hoi, feedback, goi y va tong ket bang tieng Anh.

Frontend gui truong nay khi tao session. Voi upload CV, ngon ngu duoc gui qua header:

```http
X-Interview-Language: vi
```

## API

Base URL:

```text
/api
```

### Auth

#### Dang ky

```http
POST /api/auth/register
Content-Type: application/json
```

Body:

```json
{
  "fullname": "Nguyen Van A",
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "dang ky thanh cong",
  "data": {
    "account": {},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### Dang nhap

```http
POST /api/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh token

```http
POST /api/auth/refresh-token
Content-Type: application/json
```

Body:

```json
{
  "refreshToken": "..."
}
```

#### Dang xuat

```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

### Interviews

#### Lay options setup

```http
GET /api/interviews/options
```

Tra ve danh sach vi tri, cong nghe, level, do kho, so cau hoi va ngon ngu ho tro.

#### Tao session theo setup

```http
POST /api/interviews/sessions
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:

```json
{
  "position": "Backend",
  "technology": "NodeJS",
  "level": "Junior",
  "difficulty": "medium",
  "questionCount": 5,
  "interviewLanguage": "vi"
}
```

Response co `session`. `currentQuestion` co the la `null` vi cau hoi dau tien duoc tao background.

#### Tao session theo CV PDF

```http
POST /api/interviews/cv-sessions
Authorization: Bearer <accessToken>
Content-Type: application/pdf
X-Interview-Language: vi
```

Body la raw PDF binary. Backend chi nhan PDF.

#### Tao session theo JD

```http
POST /api/interviews/jd-sessions
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:

```json
{
  "jdText": "Noi dung job description...",
  "interviewLanguage": "vi"
}
```

#### Lay session

```http
GET /api/interviews/sessions/:id
Authorization: Bearer <accessToken>
```

Tra ve session kem questions, answers va feedback neu co.

#### Lay summary session

```http
GET /api/interviews/sessions/:id/summary
Authorization: Bearer <accessToken>
```

#### Nop cau tra loi

```http
POST /api/interviews/sessions/:id/answers
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Body:

```json
{
  "questionId": 1,
  "answerText": "Cau tra loi cua ung vien...",
  "timeSpent": 90
}
```

Neu chua het cau hoi, backend tra `nextQuestion`.

Neu da het cau hoi, backend tra `evaluation`, `history`, `summary`.

### Histories

#### Lay lich su

```http
GET /api/histories
Authorization: Bearer <accessToken>
```

#### Lay thong ke

```http
GET /api/histories/stats
Authorization: Bearer <accessToken>
```

#### Lay chi tiet history

```http
GET /api/histories/:id
Authorization: Bearer <accessToken>
```

## Luu y ve AI va timeout

- Sinh cau hoi va cham diem phu thuoc Gemini nen co the cham hon API thong thuong.
- Frontend da tang timeout cho cac API AI:
  - Tao session thu cong: 90 giay.
  - CV/JD: 120 giay.
  - Nop cau tra loi: 120 giay.
- Neu van gap loi timeout, kiem tra:
  - Gemini quota.
  - Toc do network.
  - Backend log.
  - Model trong `GEMINI_MODEL`.

## Loi thuong gap

### `Dich vu AI dang qua tai hoac het quota`

Gemini API key/model bi het quota hoac chua bat billing.

### `Access token la bat buoc`

Request thieu header:

```http
Authorization: Bearer <accessToken>
```

### `CV phai la file PDF`

Endpoint CV chi nhan raw PDF. Khong gui multipart form-data neu backend chua ho tro multipart.

### Session tao xong nhung chua co cau hoi

Voi setup thu cong, cau hoi dau tien duoc tao background. Frontend se poll session. Neu qua lau, kiem tra backend log va Gemini quota.

## Kiem tra nhanh bang PowerShell

```powershell
# Options
Invoke-RestMethod http://localhost:8080/api/interviews/options

# Register
$register = Invoke-RestMethod -Method Post `
  -Uri http://localhost:8080/api/auth/register `
  -ContentType "application/json" `
  -Body (@{
    fullname = "Test User"
    email = "test@example.com"
    password = "TestPass123"
  } | ConvertTo-Json)

$token = $register.data.accessToken

# Create session
Invoke-RestMethod -Method Post `
  -Uri http://localhost:8080/api/interviews/sessions `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body (@{
    position = "Backend"
    technology = "NodeJS"
    level = "Junior"
    difficulty = "medium"
    questionCount = 5
    interviewLanguage = "vi"
  } | ConvertTo-Json)
```
