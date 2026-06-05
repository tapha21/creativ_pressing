import { createFileRoute } from "@tanstack/react-router";
import { Users, ShoppingBag, Wallet, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialOrders, revenueChartData, ordersChartData, formatXOF } from "@/lib/mock-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const statusColor: Record<string, string> = {
  "Reçu": "bg-blue-100 text-blue-700",
  "En lavage": "bg-amber-100 text-amber-700",
  "En repassage": "bg-purple-100 text-purple-700",
  "Prêt": "bg-emerald-100 text-emerald-700",
  "Livré": "bg-muted text-muted-foreground",
};

function DashboardHome() {
  const kpis = [
    { label: "Revenus (mois)", value: formatXOF(720000), trend: "+12%", icon: TrendingUp },
    { label: "Commandes", value: "184", trend: "+8%", icon: ShoppingBag },
    { label: "Clients", value: "96", trend: "+5%", icon: Users },
    { label: "Dépenses", value: formatXOF(310000), trend: "+3%", icon: Wallet },
  ];
  return (
    <div className="animate-fade-in">
      <PageHeader title="Bonjour Ousmane 👋" subtitle="Voici un aperçu de votre activité aujourd'hui." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{k.label}</div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><k.icon className="h-4 w-4 text-primary" /></div>
            </div>
            <div className="mt-3 text-2xl font-bold">{k.value}</div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> {k.trend} vs mois dernier
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenus & Dépenses</h3>
              <p className="text-xs text-muted-foreground">6 derniers mois</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.21 263)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="oklch(0.55 0.21 263)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.18 30)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.7 0.18 30)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 255)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0.03 257)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 257)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.015 255)" }} />
                <Area type="monotone" dataKey="revenu" stroke="oklch(0.55 0.21 263)" fill="url(#rev)" strokeWidth={2} />
                <Area type="monotone" dataKey="depenses" stroke="oklch(0.7 0.18 30)" fill="url(#dep)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Commandes (semaine)</h3>
          <p className="text-xs text-muted-foreground">7 derniers jours</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 255)" />
                <XAxis dataKey="day" stroke="oklch(0.5 0.03 257)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.03 257)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.015 255)" }} />
                <Bar dataKey="commandes" fill="oklch(0.55 0.21 263)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Dernières commandes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr className="border-b"><th className="py-3 pr-4">N°</th><th className="py-3 pr-4">Client</th><th className="py-3 pr-4">Montant</th><th className="py-3 pr-4">Statut</th><th className="py-3">Livraison</th></tr>
            </thead>
            <tbody>
              {initialOrders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{o.id}</td>
                  <td className="py-3 pr-4">{o.clientName}</td>
                  <td className="py-3 pr-4 font-medium">{formatXOF(o.amount)}</td>
                  <td className="py-3 pr-4"><Badge className={statusColor[o.status]} variant="secondary">{o.status}</Badge></td>
                  <td className="py-3 text-muted-foreground">{o.deliveryAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}