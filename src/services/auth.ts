export type AuthSession = {
  shopId: string;
  shopName: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
};

const AUTH_KEY = "creativ-pressing-session";

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEY);
}

export function isPwaDisplayMode() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}
