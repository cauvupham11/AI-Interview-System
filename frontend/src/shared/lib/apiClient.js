import axios from "axios";
import { appConfig } from "../../config/app.config";
import {
  clearAuthSession,
  getStoredAccessToken,
  getStoredRefreshToken,
  storeAuthSession,
} from "../../features/auth/services/auth.storage";

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    const currentRefreshToken = getStoredRefreshToken();

    if (!currentRefreshToken) {
      clearAuthSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = apiClient
          .post("/auth/refresh-token", { refreshToken: currentRefreshToken })
          .then((response) => response.data.data)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const session = await refreshPromise;
      storeAuthSession(session);
      originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      return Promise.reject(refreshError);
    }
  },
);
