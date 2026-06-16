export type OrderStatus = "Reçu" | "En lavage" | "En repassage" | "Prêt" | "Livré";
export type PaymentStatus = "Payé" | "Partiellement payé" | "Non payé";

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  createdAt: string;
  totalOrders: number;
}

export interface Order {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  items: string;
  amount: number;
  status: OrderStatus;
  payment: PaymentStatus;
  receivedAt: string;
  deliveryAt: string;
  attachmentName?: string | null;
}

export interface Expense {
  id: string;
  category: "Eau" | "Électricité" | "Salaires" | "Produits" | "Autre";
  description: string;
  amount: number;
  date: string;
}

export interface Employee {
  id: string;
  name: string;
  role: "Propriétaire" | "Employé";
  phone: string;
  joinedAt: string;
  active: boolean;
}

export interface PhotoItem {
  id: string;
  orderId: string;
  type: "Avant" | "Après";
  url: string;
  date: string;
}

export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  city: string;
  address: string;
  email: string;
  logoUrl?: string | null;
  subscriptionPlan: "Basic" | "Standard" | "Premium";
  subscriptionStatus: "Essai" | "Actif" | "Expire" | "Suspendu";
  trialEndsAt?: string | null;
  subscriptionEndsAt?: string | null;
  active: boolean;
  createdAt: string;
}

export interface RevenuePoint {
  month: string;
  revenu: number;
  depenses: number;
}

export interface OrdersPoint {
  day: string;
  commandes: number;
}

export interface DashboardSummary {
  monthlyRevenue: number;
  depositedOrders: number;
  activeClients: number;
  monthlyExpenses: number;
  revenueTrend: string;
  ordersTrend: string;
  clientsTrend: string;
  expensesTrend: string;
  revenueChart: RevenuePoint[];
  ordersChart: OrdersPoint[];
  recentOrders: Order[];
}

export interface ReportsData {
  revenueChart: RevenuePoint[];
  expenseBreakdown: { name: string; value: number }[];
  employeePerformance: { name: string; commandes: number; CA: number }[];
  hourlyOrders: { heure: string; commandes: number }[];
  paymentMethods: { name: string; value: number }[];
  topItems: { name: string; value: number }[];
}
