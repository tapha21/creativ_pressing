export type AuthSession = {
  shopId: string;
  shopName: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  subscriptionPlan: "Basic" | "Standard" | "Premium";
  subscriptionStatus: "Essai" | "Actif" | "Expire" | "Suspendu";
  trialEndsAt?: string | null;
  subscriptionEndsAt?: string | null;
  logoUrl?: string | null;
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

export function isSubscriptionUsable(session: AuthSession | null) {
  if (!session) return false;
  const today = new Date().toISOString().slice(0, 10);

  if (session.subscriptionStatus === "Essai") {
    return !session.trialEndsAt || session.trialEndsAt >= today;
  }

  if (session.subscriptionStatus === "Actif") {
    return !session.subscriptionEndsAt || session.subscriptionEndsAt >= today;
  }

  return false;
}

export function canAccessFeature(session: AuthSession | null, feature: string) {
  if (!isSubscriptionUsable(session)) return false;
  if (!session) return false;

  if (feature === "gallery") {
    return isSuperAdmin(session);
  }

  if (isEmployee(session)) {
    return ["clients", "orders"].includes(feature);
  }

  const plan = session.subscriptionPlan;
  if (plan === "Premium") return ["dashboard", "clients", "orders", "expenses", "employees", "reports", "settings"].includes(feature);
  if (plan === "Standard") return ["dashboard", "clients", "orders", "expenses", "employees", "settings"].includes(feature);
  if (plan === "Basic") return ["dashboard", "clients", "orders", "settings"].includes(feature);

  return false;
}

export function isOwnerOrAdmin(session: AuthSession | null) {
  if (!session) return false;
  return ["Propriétaire", "OWNER", "Gérant", "Admin", "Super Admin", "super_admin", "superadmin"].includes(session.role);
}

export function isEmployee(session: AuthSession | null) {
  if (!session) return false;
  return ["Employé", "EMPLOYEE"].includes(session.role);
}

export function isSuperAdmin(session: AuthSession | null) {
  if (!session) return false;
  return ["super_admin", "superadmin", "Super Admin"].includes(session.role);
}

export function isDemoSession(session: AuthSession | null) {
  return Boolean(session?.shopId.startsWith("demo-"));
}

