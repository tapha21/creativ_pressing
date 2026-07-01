import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Clock,
  CreditCard,
  FileText,
  Flame,
  Images,
  Landmark,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

export type IconItem = {
  icon: LucideIcon;
  title: string;
  desc?: string;
  items?: string[];
};

export const navLinks = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#demo-preview", label: "Démo" },
  { href: "#download", label: "Installation" },
  { href: "#advantages", label: "Avantages" },
  { href: "#faq", label: "FAQ" },
];

export const sideMenu = [
  { label: "Vue d'ensemble", icon: BarChart3 },
  { label: "Gestion Clients", icon: Users },
  { label: "Suivi Commandes", icon: ShoppingBag },
  { label: "État de Caisse", icon: Wallet },
  { label: "Rapports Équipe", icon: FileText },
];

export const dashboardKpis = [
  { label: "Caisse Jour", value: "86.500 F", text: "Encaissements", icon: Landmark },
  { label: "Commandes", value: "27 Fiches", text: "Linge déposé", icon: ShoppingBag },
  { label: "Nouveaux", value: "14 Clients", text: "Fidélisés", icon: Users },
  { label: "Statut Dépôt", value: "9 Prêts", text: "Prêt à livrer", icon: UserCheck },
  { label: "Heure Affluence", value: "17h - 19h", text: "Pic d'activité", icon: Clock },
  { label: "Dépôts Wave", value: "42.000 F", text: "Paiements mobiles", icon: Wallet },
];

export const problems = [
  { text: "Difficulté à suivre les commandes en cours", icon: Clock },
  { text: "Perte ou détérioration des tickets papier", icon: FileText },
  { text: "Oublis récurrents de paiements clients", icon: Wallet },
  { text: "Suivi opaque des dépenses opérationnelles", icon: AlertTriangle },
  { text: "Manque total de visibilité sur les bénéfices réels", icon: BarChart3 },
  { text: "Gestion manuelle fastidieuse sur cahier", icon: FileText },
];

export const features: IconItem[] = [
  {
    icon: Users,
    title: "Gestion des clients",
    items: ["Fiche client & coordonnées", "Historique complet des lavages", "Recherche instantanée par numéro", "Fidélisation intelligente"],
  },
  {
    icon: ShoppingBag,
    title: "Suivi des commandes",
    items: ["Création de dépôt ultra-rapide", "Catégorisation : robe, grand boubou, costume", "Statut clair : reçu, lavage, prêt", "Alerte automatique de retard"],
  },
  {
    icon: Wallet,
    title: "Suivi des dépenses",
    items: ["Factures d'eau et d'électricité", "Salaires & commissions du personnel", "Achat de produits de nettoyage", "Gestion des pannes & maintenance"],
  },
  {
    icon: BarChart3,
    title: "Analyses de performance",
    items: ["Évolution du chiffre d'affaires", "Graphique des heures de pointe", "Top vêtements les plus déposés", "Classement d'activité du personnel"],
  },
  {
    icon: UserCog,
    title: "Gestion d'équipe",
    items: ["Comptes dédiés pour vos employés", "Volume de commandes par agent", "Historique des actions par agent", "Attribution des rôles sécurisés"],
  },
  {
    icon: Images,
    title: "Preuves Photos & États",
    items: ["Photos avant lavage : taches, accrocs", "Photos après repassage", "Protection contre les litiges clients", "Historique visuel par commande"],
  },
  {
    icon: Bell,
    title: "Alertes & Rappels",
    items: ["Rappels des commandes en retard", "Notification de stock de lessive bas", "Alertes d'encaissements restants", "Relances clients intelligentes"],
  },
  {
    icon: FileText,
    title: "Rapports d'activité",
    items: ["Clôture de caisse journalière", "Bilan comptable hebdomadaire", "Synthèse mensuelle pour le gérant", "Calcul automatique du bénéfice net"],
  },
  {
    icon: CreditCard,
    title: "Paiements & Relances",
    items: ["Gestion des acomptes", "Filtre clients non-payés", "Répartition Wave, OM, espèces", "Historique du mode de règlement"],
  },
];

export const proofStats = [
  { icon: Sparkles, value: "3 min", label: "pour créer un dépôt complet" },
  { icon: ShieldCheck, value: "24/7", label: "données accessibles en cloud" },
  { icon: TrendingUp, value: "+25%", label: "de rentabilité mieux suivie" },
];

export const advantages: IconItem[] = [
  { icon: Clock, title: "Zéro Perte de Temps", desc: "Vos process sont automatisés, vos fiches standardisées." },
  { icon: Flame, title: "Litiges Divisés par 4", desc: "Photos d'état avant nettoyage, stockées et traçables." },
  { icon: TrendingUp, title: "+25% de Rentabilité", desc: "Chaque impayé et chaque dépense deviennent visibles." },
  { icon: ShieldCheck, title: "Fraude Évitée", desc: "Le personnel ne peut ni supprimer ni falsifier les commandes." },
  { icon: MapPin, title: "100% Réalités Locales", desc: "Pensé pour les habitudes de paiement et d'organisation au Sénégal." },
];

export const faqs = [
  {
    q: "Comment se passe l'envoi de SMS aux clients ?",
    a: "Dès que le statut de la commande passe à Prêt, un SMS personnalisé est envoyé automatiquement au client pour l'inviter à récupérer son linge.",
  },
  {
    q: "Puis-je gérer plusieurs boutiques avec un seul compte ?",
    a: "Oui. Vous pouvez basculer d'un point de vente à un autre depuis votre tableau de bord gérant.",
  },
  {
    q: "Mes données sont-elles à l'abri si je perds mon téléphone ?",
    a: "Oui. Tout est stocké sur des serveurs sécurisés. Vous changez d'appareil, vous vous reconnectez, et vos données restent disponibles.",
  },
  {
    q: "Y a-t-il une formation pour mon personnel ?",
    a: "L'interface est volontairement simple. Vous pouvez aussi ajouter des guides courts en français et en wolof pour accélérer la prise en main.",
  },
];
