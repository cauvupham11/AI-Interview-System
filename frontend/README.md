# AI Interview System - Frontend

Frontend la ung dung React/Vite cho he thong phong van AI. Ung dung ho tro dang ky/dang nhap, tao phien phong van, chon ngon ngu phong van, tra loi cau hoi AI, xem ket qua, xem lich su va dashboard thong ke.

## Cong nghe

- React 19
- Vite
- React Router
- Axios
- CSS thuan theo tung feature
- ESLint

## Cau truc thu muc

```text
frontend/
  public/                         # Static assets
  src/
    app/                          # App root, provider, router
    assets/                       # Anh, icon
    config/                       # App config
    features/
      auth/                       # Login, register, auth context, auth service
      dashboard/                  # Dashboard thong ke
      history/                    # Lich su, ket qua, chi tiet
      interviews/                 # Setup, phong phong van, result
    layouts/                      # Layout auth/dashboard
    shared/
      components/                 # Component dung chung
      constants/                  # Routes
      hooks/                      # Shared hooks
      lib/                        # apiClient
      styles/                     # App shell CSS
      utils/                      # Utility functions
```

## Cai dat

```powershell
cd D:\CV-Project\AI-Interview-System\frontend
npm install
```

Neu `npm` tren may bi loi, co the chay truc tiep Vite/ESLint bang Node:

```powershell
node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173
node node_modules\eslint\bin\eslint.js .
```

## Bien moi truong

Tao file `.env` trong thu muc `frontend` neu can doi API URL:

```env
VITE_API_URL=http://localhost:8080/api
```

Neu khong co `.env`, frontend mac dinh goi:

```text
http://localhost:8080/api
```

## Chay ung dung

```powershell
npm run dev
```

Hoac:

```powershell
node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173
```

Mo trinh duyet:

```text
http://127.0.0.1:5173
```

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## Luong man hinh

### Auth

- `/login`: dang nhap.
- `/register`: dang ky.
- Sau khi dang nhap/dang ky thanh cong, user duoc dua den `/interviews/setup`.
- Token duoc luu trong `localStorage`.
- Axios tu gan `Authorization: Bearer <accessToken>`.
- Khi API tra 401, frontend tu goi refresh token.
- Dang xuat goi `/auth/logout`, xoa session local va quay ve login.

### Setup phong van

Route:

```text
/interviews/setup
```

Nguoi dung chon:

- Vi tri: Frontend, Backend, Fullstack.
- Cong nghe: React, NodeJS, Java, Vue, MySQL.
- Level: Fresher, Junior, Middle, Senior.
- Do kho: easy, medium, hard.
- So cau hoi: 5, 10, 15.
- Ngon ngu phong van:
  - Tieng Viet (`vi`)
  - English (`en`)
- Kieu tao phong van:
  - Theo lua chon.
  - Upload CV PDF.
  - Dan JD.

Khi bam `Bat dau phong van`:

- FE goi API tao session.
- Neu tao theo setup thu cong, backend tra session nhanh va sinh cau hoi dau tien trong background.
- FE dieu huong den `/interviews/room/:sessionId`.

### Phong phong van

Route:

```text
/interviews/room/:sessionId
```

Chuc nang:

- Lay session bang `/interviews/sessions/:id`.
- Neu cau hoi dau tien chua san sang, FE poll moi 2 giay.
- Hien thi cau hoi AI va cau tra loi cua user.
- Gui cau tra loi len `/interviews/sessions/:id/answers`.
- API submit answer co timeout 120 giay vi backend can goi AI sinh cau tiep theo.
- Khi hoan thanh du so cau hoi, FE dieu huong sang trang ket qua trong history.

### Lich su

Route:

```text
/history
```

Dung API:

- `GET /histories`
- `GET /histories/stats`
- `GET /histories/:id`

### Ket qua

Routes:

```text
/history/:interviewId/result
/history/:interviewId/detail
```

Ket qua va chi tiet duoc map tu response backend sang shape UI.

## API client

File:

```text
src/shared/lib/apiClient.js
```

Chuc nang:

- Tao Axios instance.
- Gan base URL tu `VITE_API_URL`.
- Gan access token vao request.
- Tu refresh token khi gap 401.
- Xoa auth session neu refresh token that bai.

## Auth storage

File:

```text
src/features/auth/services/auth.storage.js
```

Local storage keys:

- `ai_interview_access_token`
- `ai_interview_refresh_token`
- `ai_interview_account`

## Routes

File:

```text
src/shared/constants/routes.js
```

Routes chinh:

```js
login: "/login"
register: "/register"
dashboard: "/dashboard"
interviewSetup: "/interviews/setup"
interviewRoomWithId: "/interviews/room/:sessionId"
history: "/history"
historyDetail: "/history/:interviewId/detail"
historyResult: "/history/:interviewId/result"
```

## Timeout

Mot so API AI co timeout rieng:

- Tao session setup thu cong: 90 giay.
- Tao session CV/JD: 120 giay.
- Submit answer: 120 giay.

Ly do: backend can goi Gemini de sinh cau hoi/cham diem.

## Animation/UI

Frontend co cac animation nhe:

- Fade up khi vao trang.
- Hover sweep tren card.
- Progress ring animation.
- Trang thai AI dang xu ly co pulse nhe.
- Co `prefers-reduced-motion` de giam animation khi he thong yeu cau.

## Kiem tra

Lint:

```powershell
npm run lint
```

Hoac:

```powershell
node node_modules\eslint\bin\eslint.js .
```

Build:

```powershell
npm run build
```

Neu `dist` dang bi khoa file tren Windows, build tam sang thu muc khac:

```powershell
node node_modules\vite\bin\vite.js build --outDir dist-check --emptyOutDir true
```

Sau do co the xoa:

```powershell
Remove-Item -LiteralPath ".\dist-check" -Recurse -Force
```

## Loi thuong gap

### `timeout of 15000ms exceeded`

Thuong do API AI dang mat nhieu hon timeout mac dinh. Cac API tao cau hoi/submit answer da duoc tang timeout rieng. Neu van gap, kiem tra backend log va Gemini quota.

### Bam tao phong van nhung khong thay loi

FE hien loi ngay gan nut `Bat dau phong van` va log them vao browser console:

```text
Create interview failed
```

Log gom message, status, response va payload.

### Cau hoi dau tien chua hien ngay

Voi phien setup thu cong, backend tao session truoc va sinh cau hoi dau tien trong background. FE se poll den khi cau hoi san sang.

### AI sinh cau hoi bang tieng Anh

Kiem tra muc `Chon ngon ngu phong van` o trang setup. Chon `Tieng Viet` de gui `interviewLanguage: "vi"` len backend.

### Token het han

FE tu refresh token. Neu refresh that bai, local session bi xoa va user can dang nhap lai.

## Ghi chu phat trien

- Khi backend thay doi entity, can restart backend de TypeORM sync schema trong moi truong dev.
- Khi thay doi `VITE_API_URL`, can restart Vite dev server.
- Khong sua shape response backend tuy tien; frontend service nen map response backend sang shape UI.
