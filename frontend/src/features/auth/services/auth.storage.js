export const AUTH_STORAGE_KEYS = {
  accessToken: "ai_interview_access_token",
  refreshToken: "ai_interview_refresh_token",
  account: "ai_interview_account",
};

export function getStoredAccessToken() {
  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
}

export function getStoredAccount() {
  const account = localStorage.getItem(AUTH_STORAGE_KEYS.account);

  if (!account) {
    return null;
  }

  try {
    return JSON.parse(account);
  } catch {
    return null;
  }
}

export function storeAuthSession({ accessToken, refreshToken, account }) {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, refreshToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.account, JSON.stringify(account));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.account);
}
