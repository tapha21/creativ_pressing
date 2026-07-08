import { clearAuthSession, getAuthSession, isDemoSession } from "./auth";
import { mockApiRequest } from "./demo-data";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? "https://creativ-pressing-back.onrender.com" : "")
).replace(/\/$/, "");

type RequestOptions = RequestInit & {
  skipJsonHeader?: boolean;
  auth?: boolean;
  preserveFormData?: boolean;
};

export function formatXOF(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

// Media served by the backend (e.g. /media/xxx.jpg) is returned as a relative path so it
// still works once Vercel rewrites /api/* to the Render backend in production. In local
// dev the frontend and API run on different ports, so relative paths need the API origin.
export function resolveMediaUrl(url: string | null | undefined) {
  if (!url) return null;
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const session = getAuthSession();
  const resolvedPath = withShopId(path, options, session?.shopId ?? undefined);
  const body = normalizeBody(options.body, options.preserveFormData);
  const isAuthPath = path.startsWith("/api/auth");

  if (isDemoSession(session)) {
    return mockApiRequest<T>(path, options, body, session);
  }

  if (!(body instanceof FormData) && !options.skipJsonHeader && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (session?.token && options.auth !== false && !isAuthPath && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${session.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${resolvedPath}`, {
    ...options,
    body,
    headers,
  });

  if (!response.ok) {
    // Only 401 means "this session is no longer valid" (missing/expired token, or the
    // shop got deactivated) and should force a logout. A 403 just means this particular
    // resource isn't allowed for the current role (e.g. an employee hitting an
    // owner-only endpoint) and must not blow away an otherwise valid session.
    if (response.status === 401 && session && !isAuthPath) {
      clearAuthSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const message = await readErrorMessage(response);
    throw new Error(message || `Erreur API ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function normalizeBody(body: BodyInit | null | undefined, preserveFormData = false) {
  if (!(body instanceof FormData) || preserveFormData) {
    return body;
  }

  const payload: Record<string, FormDataEntryValue> = {};
  body.forEach((value, key) => {
    if (value instanceof File && value.size === 0) return;
    if (value instanceof File) {
      payload[key === "attachment" ? "attachmentName" : key] = value.name;
      return;
    }
    payload[key] = value;
  });

  return JSON.stringify(payload);
}

function withShopId(path: string, options: RequestOptions, shopId?: string) {
  if (!shopId || options.auth === false || path.startsWith("/api/auth") || path.includes("shopId=")) {
    return path;
  }

  const method = (options.method ?? "GET").toUpperCase();
  if (method === "GET") {
    return `${path}${path.includes("?") ? "&" : "?"}shopId=${encodeURIComponent(shopId)}`;
  }

  if (options.body instanceof FormData && !options.body.has("shopId")) {
    options.body.set("shopId", shopId);
  } else if (typeof options.body === "string" && options.body.trim().startsWith("{")) {
    try {
      const payload = JSON.parse(options.body) as Record<string, unknown>;
      if (!payload.shopId) {
        options.body = JSON.stringify({ ...payload, shopId });
      }
    } catch {
      return path;
    }
  }

  return path;
}

async function readErrorMessage(response: Response) {
  const text = await response.text().catch(() => "");
  if (!text) return "";

  try {
    const payload = JSON.parse(text) as { message?: string; error?: string };
    return payload.message ?? payload.error ?? text;
  } catch {
    return text;
  }
}
