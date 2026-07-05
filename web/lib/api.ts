const BASE_URL = "http://localhost:8001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  get<T>(url: string): Promise<T> {
    return request<T>("GET", url);
  },
  post<T>(url: string, body?: unknown): Promise<T> {
    return request<T>("POST", url, body);
  },
  put<T>(url: string, body?: unknown): Promise<T> {
    return request<T>("PUT", url, body);
  },
  patch<T>(url: string, body?: unknown): Promise<T> {
    return request<T>("PATCH", url, body);
  },
  delete<T>(url: string): Promise<T> {
    return request<T>("DELETE", url);
  },
};
