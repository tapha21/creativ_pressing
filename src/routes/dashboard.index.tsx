import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowUpRight, Calendar, Layers, ShoppingBag, TrendingUp, Users, Wallet } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatXOF } from "@/services/api";
import { pressingApi } from "@/services/pressing-api";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const statusColor: Record<string, string> = {
  Reçu: "bg-blue-50 text-blue-700 border-blue-100",
  "En lavage": "bg-amber-50 text-amber-700 border-amber-100",
  "En repassage": "bg-purple-50 text-purple-700 border-purple-100",
  Prêt: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Livré: "bg-slate-100 text-slate-600 border-transparent",
};

const DashboardTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="space-y-1 rounded-xl border border-slate-200 bg-background p-3 text-xs font-medium shadow-xl">
      <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        <Calendar className="h-3 w-3" /> {label}
      </p>
      {payload.map((item: any, index: number) => (
        <p key={index} style={{ color: item.color || item.fill }} className="text-sm font-black tracking-tight">
          {item.name} : {typeof item.value === "number" && item.value > 1000 ? formatXOF(item.value) : item.value}
        </p>
      ))}
    </div>
  );
};

function DashboardHome() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: pressingApi.dashboard,
  });

  const kpis = [
    { label: "Revenus (mois)", value: formatXOF(data?.monthlyRevenue ?? 0), trend: data?.revenueTrend ?? "0%", icon: TrendingUp, bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { label: "Commandes déposées", value: String(data?.depositedOrders ?? 0), trend: data?.ordersTrend ?? "0%", icon: ShoppingBag, bg: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Clients actifs", value: String(data?.activeClients ?? 0), trend: data?.clientsTrend ?? "0%", icon: Users, bg: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "Dépenses engagées", value: formatXOF(data?.monthlyExpenses ?? 0), trend: data?.expensesTrend ?? "0%", icon: Wallet, bg: "bg-rose-50 text-rose-600 border-rose-100" },
  ];

  const revenueChart = data?.revenueChart ?? [];
  const ordersChart = data?.ordersChart ?? [];
  const recentOrders = data?.recentOrders ?? [];
  const emptyMessage = isLoading
    ? "Chargement du tableau de bord..."
    : isError
      ? "Connectez votre API pour afficher les indicateurs."
      : "Aucune commande récente.";

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader title="Tableau de bord" subtitle="Situation globale et état des flux de votre pressing." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="flex flex-col justify-between border-slate-200/80 bg-background p-5 shadow-sm">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{kpi.label}</span>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border shadow-sm ${kpi.bg}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 break-words text-2xl font-black tracking-tight text-slate-900">{kpi.value}</div>
            </div>
            <div className="mt-3 inline-flex w-fit items-center gap-1 rounded-lg border border-emerald-100 bg-emerald-50/60 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" /> {kpi.trend}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200/80 bg-background p-5 shadow-sm lg:col-span-2">
          <ChartHeader icon={Activity} title="Courbe de trésorerie" subtitle="Évolution financière" />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip content={<DashboardTooltip />} />
                <Area type="monotone" name="Revenu" dataKey="revenu" stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} strokeWidth={2.5} />
                <Area type="monotone" name="Dépenses" dataKey="depenses" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.08} strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border-slate-200/80 bg-background p-5 shadow-sm">
          <ChartHeader icon={Layers} title="Flux des dépôts" subtitle="Volume de commandes" />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersChart} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip content={<DashboardTooltip />} />
                <Bar name="Commandes" dataKey="commandes" fill="#4f46e5" radius={[5, 5, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-slate-200/80 bg-background shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/40 p-5">
          <div>
            <h3 className="font-bold tracking-tight text-slate-900">Suivi des flux récents</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Derniers dépôts enregistrés en comptoir</p>
          </div>
        </div>
        <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
          {recentOrders.map((order) => (
            <Card key={order.id} className="border-slate-200 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-primary">#{order.id}</div>
                  <h3 className="mt-1 truncate text-sm font-black text-slate-900">{order.clientName}</h3>
                  <p className="mt-2 text-xs font-medium text-slate-500">Retrait prevu : {order.deliveryAt}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900">{formatXOF(order.amount)}</div>
                  <Badge className={`mt-2 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusColor[order.status] || "bg-slate-100 text-slate-700"}`} variant="outline">
                    {order.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
          {(recentOrders.length === 0 || isLoading || isError) && (
            <Card className="border-dashed border-slate-200 p-8 text-center font-medium text-slate-400 sm:col-span-2 xl:col-span-3">
              {emptyMessage}
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}

function ChartHeader({ icon: Icon, title, subtitle }: { icon: typeof Activity; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="rounded-lg bg-blue-50 p-1.5 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
