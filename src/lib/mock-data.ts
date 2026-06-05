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
  clientId: string;
  clientName: string;
  items: string;
  amount: number;
  status: OrderStatus;
  payment: PaymentStatus;
  receivedAt: string;
  deliveryAt: string;
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

export const initialClients: Client[] = [
  { id: "c1", name: "Aminata Diop", phone: "+221 77 123 45 67", address: "Sacré-Cœur 3", city: "Dakar", createdAt: "2026-05-12", totalOrders: 14 },
  { id: "c2", name: "Moussa Ndiaye", phone: "+221 76 987 65 43", address: "Avenue Bourguiba", city: "Dakar", createdAt: "2026-05-20", totalOrders: 8 },
  { id: "c3", name: "Fatou Sarr", phone: "+221 78 456 12 34", address: "Médina", city: "Thiès", createdAt: "2026-04-02", totalOrders: 22 },
  { id: "c4", name: "Cheikh Fall", phone: "+221 70 222 33 44", address: "HLM Grand-Yoff", city: "Dakar", createdAt: "2026-03-15", totalOrders: 5 },
  { id: "c5", name: "Mariama Ba", phone: "+221 77 555 66 77", address: "Sor", city: "Saint-Louis", createdAt: "2026-02-10", totalOrders: 31 },
  { id: "c6", name: "Ibrahima Sow", phone: "+221 76 111 22 33", address: "Almadies", city: "Dakar", createdAt: "2026-05-28", totalOrders: 3 },
];

export const initialOrders: Order[] = [
  { id: "CMD-1042", clientId: "c1", clientName: "Aminata Diop", items: "3 chemises, 1 costume", amount: 15000, status: "En lavage", payment: "Partiellement payé", receivedAt: "2026-06-03", deliveryAt: "2026-06-06" },
  { id: "CMD-1043", clientId: "c2", clientName: "Moussa Ndiaye", items: "5 pantalons", amount: 8500, status: "Prêt", payment: "Payé", receivedAt: "2026-06-02", deliveryAt: "2026-06-05" },
  { id: "CMD-1044", clientId: "c3", clientName: "Fatou Sarr", items: "2 robes, 1 boubou", amount: 12000, status: "Livré", payment: "Payé", receivedAt: "2026-05-30", deliveryAt: "2026-06-02" },
  { id: "CMD-1045", clientId: "c4", clientName: "Cheikh Fall", items: "1 costume", amount: 6000, status: "En repassage", payment: "Non payé", receivedAt: "2026-06-04", deliveryAt: "2026-06-07" },
  { id: "CMD-1046", clientId: "c5", clientName: "Mariama Ba", items: "4 boubous brodés", amount: 22000, status: "Reçu", payment: "Partiellement payé", receivedAt: "2026-06-05", deliveryAt: "2026-06-09" },
  { id: "CMD-1047", clientId: "c1", clientName: "Aminata Diop", items: "2 chemises", amount: 4000, status: "En lavage", payment: "Payé", receivedAt: "2026-06-05", deliveryAt: "2026-06-07" },
  { id: "CMD-1048", clientId: "c6", clientName: "Ibrahima Sow", items: "1 veste", amount: 3500, status: "Prêt", payment: "Payé", receivedAt: "2026-06-04", deliveryAt: "2026-06-06" },
  { id: "CMD-1049", clientId: "c2", clientName: "Moussa Ndiaye", items: "6 chemises", amount: 9000, status: "Livré", payment: "Payé", receivedAt: "2026-05-29", deliveryAt: "2026-06-01" },
];

export const initialExpenses: Expense[] = [
  { id: "e1", category: "Électricité", description: "Facture Senelec mai", amount: 45000, date: "2026-06-01" },
  { id: "e2", category: "Eau", description: "Facture SDE", amount: 12000, date: "2026-06-02" },
  { id: "e3", category: "Salaires", description: "Salaire Awa - Mai", amount: 90000, date: "2026-05-31" },
  { id: "e4", category: "Produits", description: "Lessive industrielle 25kg", amount: 35000, date: "2026-06-03" },
  { id: "e5", category: "Autre", description: "Réparation fer à repasser", amount: 8000, date: "2026-06-04" },
  { id: "e6", category: "Produits", description: "Détachant + amidon", amount: 18000, date: "2026-05-28" },
];

export const initialEmployees: Employee[] = [
  { id: "em1", name: "Awa Diallo", role: "Employé", phone: "+221 77 234 56 78", joinedAt: "2025-09-12", active: true },
  { id: "em2", name: "Modou Kane", role: "Employé", phone: "+221 76 345 67 89", joinedAt: "2024-11-04", active: true },
  { id: "em3", name: "Bineta Gueye", role: "Employé", phone: "+221 70 456 78 90", joinedAt: "2026-01-20", active: true },
  { id: "em4", name: "Ousmane Diop", role: "Propriétaire", phone: "+221 77 000 00 01", joinedAt: "2024-01-01", active: true },
];

export const initialPhotos: PhotoItem[] = [
  { id: "p1", orderId: "CMD-1042", type: "Avant", url: "https://images.unsplash.com/photo-1521498542256-5aeb47ba2b36?w=600&q=80", date: "2026-06-03" },
  { id: "p2", orderId: "CMD-1042", type: "Après", url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80", date: "2026-06-05" },
  { id: "p3", orderId: "CMD-1044", type: "Avant", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80", date: "2026-05-30" },
  { id: "p4", orderId: "CMD-1044", type: "Après", url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80", date: "2026-06-02" },
  { id: "p5", orderId: "CMD-1046", type: "Avant", url: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80", date: "2026-06-05" },
  { id: "p6", orderId: "CMD-1047", type: "Avant", url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80", date: "2026-06-05" },
];

export const revenueChartData = [
  { month: "Jan", revenu: 420000, depenses: 210000 },
  { month: "Fév", revenu: 480000, depenses: 230000 },
  { month: "Mar", revenu: 510000, depenses: 250000 },
  { month: "Avr", revenu: 590000, depenses: 270000 },
  { month: "Mai", revenu: 640000, depenses: 295000 },
  { month: "Juin", revenu: 720000, depenses: 310000 },
];

export const ordersChartData = [
  { day: "Lun", commandes: 22 },
  { day: "Mar", commandes: 28 },
  { day: "Mer", commandes: 19 },
  { day: "Jeu", commandes: 34 },
  { day: "Ven", commandes: 41 },
  { day: "Sam", commandes: 52 },
  { day: "Dim", commandes: 12 },
];

export const formatXOF = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";