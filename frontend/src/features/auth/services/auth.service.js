import { apiClient } from "../../../shared/lib/apiClient";

function unwrapAuthResponse(response) {
  return response.data.data;
}

export function getApiErrorMessage(error, fallbackMessage) {
  const message = error.response?.data?.message || error.message || fallbackMessage;

  if (message?.includes("quota") || message?.includes("429")) {
    return "Dịch vụ AI đang quá tải hoặc hết quota. Vui lòng thử lại sau.";
  }

  if (message?.includes("fetch failed") || message?.includes("Network Error")) {
    return "Không thể kết nối tới máy chủ. Vui lòng kiểm tra backend và thử lại.";
  }

  return message;
}

export async function register(payload) {
  const response = await apiClient.post("/auth/register", {
    fullname: payload.fullName,
    email: payload.email,
    password: payload.password,
  });

  return unwrapAuthResponse(response);
}

export async function login(payload) {
  const response = await apiClient.post("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  return unwrapAuthResponse(response);
}

export async function refreshToken(refreshToken) {
  const response = await apiClient.post("/auth/refresh-token", { refreshToken });

  return unwrapAuthResponse(response);
}

export async function logout() {
  await apiClient.post("/auth/logout");
}
