const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

type RequestOptions = RequestInit & {
  skipJsonHeader?: boolean;
};

export function formatXOF(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!options.skipJsonHeader && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Erreur API ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
