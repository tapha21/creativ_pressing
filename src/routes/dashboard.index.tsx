import { createFileRoute } from "@tanstack/react-router";
import { Users, ShoppingBag, Wallet, TrendingUp, ArrowUpRight, Calendar, Layers, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialOrders, revenueChartData, ordersChartData, formatXOF } from "@/lib/mock-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

// 🎨 Badges sémantiques pour suivre l'état d'avancement du linge
const statusColor: Record<string, string> = {
  "Reçu": "bg-blue-50 text-blue-700 border-blue-100",
  "En lavage": "bg-amber-50 text-amber-700 border-amber-100",
  "En repassage": "bg-purple-50 text-purple-700 border-purple-100",
  "Prêt": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "Livré": "bg-slate-100 text-slate-600 border-transparent",
};

// 📊 Infobulle personnalisée et unifiée pour les graphiques du Dashboard
const DashboardTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-slate-200 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs font-medium space-y-1">
        <p className="text-slate-400 font-bold tracking-wide uppercase text-[10px] flex items-center gap-1 mb-1">
          <Calendar className="h-3 w-3" /> {label}
        </p>
        {payload.map((item: any, idx: number) => (
          <p key={idx} style={{ color: item.color || item.fill }} className="text-sm font-black tracking-tight">
            {item.name} : {typeof item.value === "number" && item.value > 1000 ? formatXOF(item.value) : item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function DashboardHome() {
  const kpis = [
    { label: "Revenus (mois)", value: formatXOF(720000), trend: "+12%", icon: TrendingUp, bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { label: "Commandes déposées", value: "184", trend: "+8%", icon: ShoppingBag, bg: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Clients actifs", value: "96", trend: "+5%", icon: Users, bg: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "Dépenses engagées", value: formatXOF(310000), trend: "+3%", icon: Wallet, bg: "bg-rose-50 text-rose-600 border-rose-100" },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      {/* Salutation personnalisée */}
      <PageHeader 
        title="Bonjour Ousmane 👋" 
        subtitle="Voici la situation globale et l'état des flux de votre pressing aujourd'hui." 
      />
      
      {/* 📈 Section Grille des indicateurs (KPIs) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5 border-slate-200/80 shadow-sm bg-background flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{k.label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition-transform group-hover:scale-105 ${k.bg}`}>
                  <k.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 tracking-tight">{k.value}</div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50/60 border border-emerald-100 rounded-lg px-2 py-0.5 w-fit">
              <ArrowUpRight className="h-3 w-3" /> {k.trend} <span className="text-slate-400 font-medium">vs mois dernier</span>
            </div>
          </Card>
        ))}
      </div>

      {/* 📊 Section des graphiques analytiques */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Graphique d'Aires : Revenus vs Dépenses */}
        <Card className="p-5 lg:col-span-2 border-slate-200/80 shadow-sm bg-background">
          <div className="mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">Courbe de Trésorerie</h3>
              <p className="text-[11px] text-muted-foreground">Évolution financière des 6 derniers mois</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<DashboardTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
                <Area type="monotone" name="Revenu" dataKey="revenu" stroke="#2563eb" fill="url(#revGrad)" strokeWidth={2.5} />
                <Area type="monotone" name="Dépenses" dataKey="depenses" stroke="#f43f5e" fill="url(#depGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Graphique en Barres : Flux des Commandes */}
        <Card className="p-5 border-slate-200/80 shadow-sm bg-background">
          <div className="mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">Flux des dépôts</h3>
              <p className="text-[11px] text-muted-foreground">Volume de commandes des 7 derniers jours</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip content={<DashboardTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar name="Commandes" dataKey="commandes" fill="#4f46e5" radius={[5, 5, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 📋 Section : Registre des Dernières Commandes */}
      <Card className="border-slate-200/80 shadow-sm overflow-hidden bg-background">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
          <div>
            <h3 className="font-bold text-slate-900 tracking-tight">Suivi des flux récents</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Vue immédiate sur les 6 derniers dépôts enregistrés en comptoir</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium text-xs uppercase tracking-wider">
                <th className="py-3 px-6 text-left font-semibold">N° Commande</th>
                <th className="py-3 px-6 text-left font-semibold">Nom du Client</th>
                <th className="py-3 px-6 text-left font-semibold">Montant Facturé</th>
                <th className="py-3 px-6 text-left font-semibold">Statut Traitement</th>
                <th className="py-3 px-6 text-left font-semibold">Date de Retrait prévu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialOrders.slice(0, 6).map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3.5 px-6 whitespace-nowrap font-bold text-primary text-xs">
                    {o.id}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap font-semibold text-slate-800">
                    {o.clientName}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap font-bold text-slate-900">
                    {formatXOF(o.amount)}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <Badge className={`px-2.5 py-0.5 font-bold rounded-full text-[11px] border shadow-none ${statusColor[o.status] || "bg-slate-100 text-slate-700"}`} variant="outline">
                      {o.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 font-medium text-xs">
                    {o.deliveryAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}