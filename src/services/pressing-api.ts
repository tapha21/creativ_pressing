import { apiRequest } from "./api";
import type {
  Client,
  DashboardSummary,
  Employee,
  Expense,
  Order,
  PhotoItem,
  ReportsData,
} from "./types";

export const pressingApi = {
  dashboard: () => apiRequest<DashboardSummary>("/api/dashboard"),
  reports: () => apiRequest<ReportsData>("/api/reports"),

  clients: {
    list: () => apiRequest<Client[]>("/api/clients"),
    create: (payload: Omit<Client, "id" | "createdAt" | "totalOrders">) =>
      apiRequest<Client>("/api/clients", { method: "POST", body: JSON.stringify(payload) }),
    update: (id: string, payload: Partial<Client>) =>
      apiRequest<Client>(`/api/clients/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id: string) => apiRequest<void>(`/api/clients/${id}`, { method: "DELETE" }),
  },

  orders: {
    list: () => apiRequest<Order[]>("/api/orders"),
    create: (payload: FormData) =>
      apiRequest<Order>("/api/orders", { method: "POST", body: payload, skipJsonHeader: true }),
    update: (id: string, payload: FormData | Partial<Order>) =>
      apiRequest<Order>(`/api/orders/${id}`, {
        method: "PUT",
        body: payload instanceof FormData ? payload : JSON.stringify(payload),
        skipJsonHeader: payload instanceof FormData,
      }),
    remove: (id: string) => apiRequest<void>(`/api/orders/${id}`, { method: "DELETE" }),
  },

  expenses: {
    list: () => apiRequest<Expense[]>("/api/expenses"),
    create: (payload: Omit<Expense, "id">) =>
      apiRequest<Expense>("/api/expenses", { method: "POST", body: JSON.stringify(payload) }),
    update: (id: string, payload: Partial<Expense>) =>
      apiRequest<Expense>(`/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id: string) => apiRequest<void>(`/api/expenses/${id}`, { method: "DELETE" }),
  },

  employees: {
    list: () => apiRequest<Employee[]>("/api/employees"),
    create: (payload: Pick<Employee, "name" | "phone" | "role">) =>
      apiRequest<Employee>("/api/employees", { method: "POST", body: JSON.stringify(payload) }),
    update: (id: string, payload: Partial<Employee>) =>
      apiRequest<Employee>(`/api/employees/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    remove: (id: string) => apiRequest<void>(`/api/employees/${id}`, { method: "DELETE" }),
  },

  photos: {
    list: () => apiRequest<PhotoItem[]>("/api/photos"),
    upload: (payload: FormData) =>
      apiRequest<PhotoItem>("/api/photos", { method: "POST", body: payload, skipJsonHeader: true }),
    remove: (id: string) => apiRequest<void>(`/api/photos/${id}`, { method: "DELETE" }),
  },
};
