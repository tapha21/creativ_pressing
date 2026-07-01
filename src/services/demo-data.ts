import type { AuthSession } from "./auth";
import type { Client, DashboardSummary, Employee, Expense, Order, PhotoItem, ReportsData, Shop } from "./types";

type DemoStore = {
  shop: Shop;
  clients: Client[];
  orders: Order[];
  expenses: Expense[];
  employees: Employee[];
  photos: PhotoItem[];
};

type Body = BodyInit | null | undefined;

const today = "2026-06-17";

export function createDemoSession(plan: AuthSession["subscriptionPlan"]): AuthSession {
  const shopId = `demo-${plan.toLowerCase()}`;
  const trialEndsAt = "2026-07-17";

  seedDemoStore(shopId, plan, trialEndsAt);

  return {
    shopId,
    shopName: `Demo Pressing ${plan}`,
    userId: `demo-user-${plan.toLowerCase()}`,
    userName: `Client Demo ${plan}`,
    email: `demo.${plan.toLowerCase()}@creativpressing.sn`,
    role: "owner",
    subscriptionPlan: plan,
    subscriptionStatus: "Essai",
    trialEndsAt,
    subscriptionEndsAt: null,
    logoUrl: null,
  };
}

export async function mockApiRequest<T>(path: string, options: RequestInit = {}, body?: Body, session?: AuthSession | null): Promise<T> {
  if (!session?.shopId.startsWith("demo-")) {
    throw new Error("Session demo introuvable");
  }

  const method = (options.method ?? "GET").toUpperCase();
  const store = loadStore(session);
  const cleanPath = path.split("?")[0];
  const payload = payloadFromBody(body);

  if (cleanPath === "/api/dashboard" && method === "GET") return buildDashboard(store) as T;
  if (cleanPath === "/api/reports" && method === "GET") return buildReports(store) as T;

  if (cleanPath.startsWith("/api/shops/")) {
    if (method === "GET") return store.shop as T;
    if (method === "PUT") {
      store.shop = { ...store.shop, ...payload };
      saveStore(session.shopId, store);
      return store.shop as T;
    }
  }

  const collection = getCollection(cleanPath);
  if (collection) {
    const { name, id, upload } = collection;
    const list = store[name] as Array<Record<string, unknown>>;

    if (method === "GET" && !id) return list as T;

    if (method === "POST" && !id) {
      const created = createItem(name, payload, store, upload);
      (store[name] as Array<Record<string, unknown>>).unshift(created);
      saveStore(session.shopId, store);
      return created as T;
    }

    if ((method === "PUT" || method === "PATCH") && id) {
      const index = list.findIndex((item) => item.id === id);
      if (index < 0) throw new Error("Element demo introuvable");
      list[index] = { ...list[index], ...payload };
      saveStore(session.shopId, store);
      return list[index] as T;
    }

    if (method === "DELETE" && id) {
      store[name] = list.filter((item) => item.id !== id) as never;
      saveStore(session.shopId, store);
      return undefined as T;
    }
  }

  throw new Error(`Route demo non geree: ${method} ${cleanPath}`);
}

function getCollection(path: string) {
  const match = path.match(/^\/api\/(clients|orders|expenses|employees|photos)(?:\/([^/]+))?(?:\/([^/]+))?$/);
  if (!match) return null;
  const [, resource, second, third] = match;
  if (resource === "photos" && second === "upload") return { name: "photos" as const, id: "", upload: true };
  if (resource === "orders" && third === "status") return { name: "orders" as const, id: second ?? "", upload: false };
  return { name: resource as "clients" | "orders" | "expenses" | "employees" | "photos", id: second ?? "", upload: false };
}

function createItem(name: keyof Pick<DemoStore, "clients" | "orders" | "expenses" | "employees" | "photos">, payload: Record<string, unknown>, store: DemoStore, upload = false) {
  const id = `${name.slice(0, 3).toUpperCase()}-${Date.now().toString(36).slice(-5)}`;

  if (name === "clients") {
    return { id, createdAt: today, totalOrders: 0, ...payload };
  }
  if (name === "orders") {
    return {
      id,
      clientName: "",
      items: "",
      status: "Reçu",
      payment: "Non payé",
      receivedAt: today,
      deliveryAt: today,
      ...payload,
      amount: Number(payload.amount ?? 0),
    };
  }
  if (name === "expenses") {
    return { id, category: "Autre", description: "", amount: Number(payload.amount ?? 0), date: today, ...payload };
  }
  if (name === "employees") {
    return { id, name: "", role: "Employé", phone: "", joinedAt: today, active: true, ...payload };
  }

  return {
    id,
    orderId: String(payload.orderId ?? store.orders[0]?.id ?? "CMD-DEMO"),
    type: String(payload.type ?? "Avant"),
    url: upload ? "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=900&q=80" : String(payload.url ?? ""),
    date: today,
  };
}

function payloadFromBody(body: Body): Record<string, unknown> {
  if (!body) return {};
  if (body instanceof FormData) {
    const payload: Record<string, unknown> = {};
    body.forEach((value, key) => {
      payload[key] = value instanceof File ? value.name : value;
    });
    return payload;
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

function seedDemoStore(shopId: string, plan: AuthSession["subscriptionPlan"], trialEndsAt: string) {
  if (localStorage.getItem(storeKey(shopId))) return;
  saveStore(shopId, buildInitialStore(shopId, plan, trialEndsAt));
}

function loadStore(session: AuthSession) {
  seedDemoStore(session.shopId, session.subscriptionPlan, session.trialEndsAt ?? "2026-07-17");
  return JSON.parse(localStorage.getItem(storeKey(session.shopId)) ?? "{}") as DemoStore;
}

function saveStore(shopId: string, store: DemoStore) {
  localStorage.setItem(storeKey(shopId), JSON.stringify(store));
}

function storeKey(shopId: string) {
  return `creativ-pressing-demo-store:${shopId}`;
}

function buildInitialStore(shopId: string, plan: AuthSession["subscriptionPlan"], trialEndsAt: string): DemoStore {
  const clients: Client[] = [
    { id: "CL-1001", name: "Awa Diop", phone: "+221 77 123 45 67", address: "Mermoz", city: "Dakar", createdAt: "2026-06-01", totalOrders: 4 },
    { id: "CL-1002", name: "Mamadou Fall", phone: "+221 76 222 18 90", address: "Centre-ville", city: "Thies", createdAt: "2026-06-03", totalOrders: 2 },
    { id: "CL-1003", name: "Fatou Ndiaye", phone: "+221 78 987 10 11", address: "Almadies", city: "Dakar", createdAt: "2026-06-08", totalOrders: 5 },
  ];

  const orders: Order[] = [
    { id: "CMD-2401", clientId: "CL-1001", clientName: "Awa Diop", clientPhone: "+221 77 123 45 67", items: "2 complets, 4 chemises", amount: 18500, status: "Prêt", payment: "Partiellement payé", receivedAt: "2026-06-15", deliveryAt: "2026-06-18" },
    { id: "CMD-2402", clientId: "CL-1002", clientName: "Mamadou Fall", clientPhone: "+221 76 222 18 90", items: "Rideaux salon, draps", amount: 32000, status: "En lavage", payment: "Non payé", receivedAt: "2026-06-16", deliveryAt: "2026-06-20" },
    { id: "CMD-2403", clientId: "CL-1003", clientName: "Fatou Ndiaye", clientPhone: "+221 78 987 10 11", items: "Boubou brode, foulard", amount: 14500, status: "Reçu", payment: "Payé", receivedAt: today, deliveryAt: "2026-06-19" },
  ] as Order[];

  return {
    shop: {
      id: shopId,
      name: `Demo Pressing ${plan}`,
      ownerName: "Client Demo",
      phone: "+221 77 000 00 00",
      city: "Dakar",
      address: "Point E",
      email: `demo.${plan.toLowerCase()}@creativpressing.sn`,
      logoUrl: null,
      subscriptionPlan: plan,
      subscriptionStatus: "Essai",
      trialEndsAt,
      subscriptionEndsAt: null,
      active: true,
      createdAt: today,
    },
    clients,
    orders,
    expenses: [
      { id: "EXP-101", category: "Eau", description: "Facture eau juin", amount: 18000, date: "2026-06-05" },
      { id: "EXP-102", category: "Produits", description: "Lessive et emballages", amount: 42000, date: "2026-06-09" },
      { id: "EXP-103", category: "Salaires", description: "Avance equipe", amount: 65000, date: "2026-06-15" },
    ] as Expense[],
    employees: [
      { id: "EMP-01", name: "Awa Sarr", role: "Propriétaire", phone: "+221 77 555 10 10", joinedAt: "2026-01-12", active: true },
      { id: "EMP-02", name: "Ibrahima Kane", role: "Employé", phone: "+221 76 444 20 20", joinedAt: "2026-03-04", active: true },
    ] as Employee[],
    photos: [
      { id: "PH-01", orderId: "CMD-2401", type: "Avant", url: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=900&q=80", date: "2026-06-15" },
      { id: "PH-02", orderId: "CMD-2401", type: "Après", url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80", date: "2026-06-17" },
    ] as PhotoItem[],
  };
}

function buildDashboard(store: DemoStore): DashboardSummary {
  const monthlyRevenue = store.orders.reduce((sum, order) => sum + Number(order.amount), 0);
  const monthlyExpenses = store.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return {
    monthlyRevenue,
    depositedOrders: store.orders.length,
    activeClients: store.clients.length,
    monthlyExpenses,
    revenueTrend: "+18%",
    ordersTrend: "+9%",
    clientsTrend: "+12%",
    expensesTrend: "-4%",
    revenueChart: buildRevenueChart(store),
    ordersChart: [
      { day: "Lun", commandes: 7 },
      { day: "Mar", commandes: 9 },
      { day: "Mer", commandes: 6 },
      { day: "Jeu", commandes: 12 },
      { day: "Ven", commandes: 15 },
      { day: "Sam", commandes: 10 },
    ],
    recentOrders: store.orders.slice(0, 6),
  };
}

function buildReports(store: DemoStore): ReportsData {
  return {
    revenueChart: buildRevenueChart(store),
    expenseBreakdown: [
      { name: "Produits", value: 42000 },
      { name: "Salaires", value: 65000 },
      { name: "Eau", value: 18000 },
      { name: "Electricite", value: 24000 },
    ],
    employeePerformance: store.employees.map((employee, index) => ({ name: employee.name.split(" ")[0], commandes: 8 + index * 4, CA: 60000 + index * 25000 })),
    hourlyOrders: [
      { heure: "08h", commandes: 3 },
      { heure: "10h", commandes: 7 },
      { heure: "12h", commandes: 5 },
      { heure: "15h", commandes: 9 },
      { heure: "18h", commandes: 13 },
    ],
    paymentMethods: [
      { name: "Wave", value: 52000 },
      { name: "Especes", value: 36000 },
      { name: "Orange Money", value: 18000 },
    ],
    topItems: [
      { name: "Chemises", value: 28 },
      { name: "Boubous", value: 16 },
      { name: "Complets", value: 12 },
      { name: "Draps", value: 9 },
    ],
  };
}

function buildRevenueChart(store: DemoStore) {
  const revenue = store.orders.reduce((sum, order) => sum + Number(order.amount), 0);
  const expenses = store.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  return [
    { month: "Jan", revenu: 260000, depenses: 115000 },
    { month: "Fev", revenu: 310000, depenses: 128000 },
    { month: "Mar", revenu: 295000, depenses: 122000 },
    { month: "Avr", revenu: 360000, depenses: 146000 },
    { month: "Mai", revenu: 410000, depenses: 152000 },
    { month: "Juin", revenu: Math.max(revenue, 210000), depenses: Math.max(expenses, 98000) },
  ];
}

