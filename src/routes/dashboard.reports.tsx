import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, BarChart3, Calendar, Clock, LineChart as LineIcon, PieChart as PieIcon, Shirt, Sparkles, TrendingUp, Users, Wallet } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatXOF } from "@/services/api";
import { pressingApi } from "@/services/pressing-api";

export const Route = createFileRoute("/dashboard/reports")({ component: ReportsPage });

const CHART_COLORS = ["#2563eb", "#f59e0b", "#8b5cf6", "#06b6d4", "#10b981", "#f43f5e"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="space-y-1 rounded-xl border border-slate-200 bg-background p-3 text-xs font-medium shadow-xl">
      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        <Calendar className="h-3 w-3" /> {label}
      </p>
      {payload.map((item: any, index: number) => {
        const isQuantity = String(item.name).toLowerCase().includes("commande") || String(item.name).toLowerCase().includes("part");
        return (
          <p key={index} style={{ color: item.color || item.fill }} className="text-sm font-black tracking-tight">
            {item.name} : {isQuantity ? `${item.value} unités` : formatXOF(item.value)}
          </p>
        );
      })}
    </div>
  );
};

function ReportsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports"],
    queryFn: pressingApi.reports,
  });

  const revenueChart = data?.revenueChart ?? [];
  const latest = revenueChart.at(-1);
  const revenue = latest?.revenu ?? 0;
  const expenses = latest?.depenses ?? 0;
  const profit = revenueChart.map((item) => ({ month: item.month, benefice: item.revenu - item.depenses }));
  const emptyMessage = isLoading ? "Chargement des rapports..." : isError ? "Connectez votre API pour afficher les rapports." : "Aucune donnée de rapport disponible.";

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-900 antialiased">
      <PageHeader
        title="Rapports & Analyses"
        subtitle="Performance, affluence horaire et productivité de votre équipe"
        actions={
          <Badge variant="outline" className="gap-1.5 rounded-full border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Exercice en cours
          </Badge>
        }
      />

      {(isLoading || isError || !data) && (
        <Card className="border-2 border-dashed border-slate-200 p-8 text-center font-medium text-slate-400 shadow-none">
          {emptyMessage}
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Chiffre d'affaires" value={formatXOF(revenue)} icon={TrendingUp} tone="emerald" />
        <KpiCard title="Charges & dépenses" value={formatXOF(expenses)} icon={ArrowDownRight} tone="rose" />
        <KpiCard title="Résultat net" value={formatXOF(revenue - expenses)} icon={Sparkles} tone="blue" />
      </div>

      <Card className="border-slate-200/80 bg-background p-5 shadow-sm">
        <ChartTitle icon={Clock} title="Affluence et heures de pointe" subtitle="Volume de dépôts/retraits selon l'heure" />
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.hourlyOrders ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="heure" fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
              <YAxis fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" name="Commandes" dataKey="commandes" stroke="#f59e0b" strokeWidth={2.5} fill="#f59e0b" fillOpacity={0.12} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200/80 bg-background p-5 shadow-sm">
          <ChartTitle icon={Users} title="Activité du personnel" subtitle="Volume de fiches gérées par agent" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.employeePerformance ?? []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Commandes enregistrées" dataKey="commandes" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <PieCard icon={Wallet} title="Canaux de règlement" subtitle="Répartition par mode de paiement" data={data?.paymentMethods ?? []} offset={2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200/80 bg-background p-5 shadow-sm">
          <ChartTitle icon={LineIcon} title="Évolution du bénéfice net" subtitle="Différence revenus moins dépenses" />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profit} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" name="Bénéfice" dataKey="benefice" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <PieCard icon={Shirt} title="Top catégories de vêtements" subtitle="Typologie des pièces déposées" data={data?.topItems ?? []} offset={1} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PieCard icon={PieIcon} title="Répartition des charges" subtitle="Catégories de dépenses" data={data?.expenseBreakdown ?? []} offset={0} />
        <Card className="border-slate-200/80 bg-background p-5 shadow-sm">
          <ChartTitle icon={BarChart3} title="Trésorerie mensuelle" subtitle="Revenus et dépenses" />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChart} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Revenu" dataKey="revenu" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={36} />
                <Bar name="Dépenses" dataKey="depenses" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, tone }: { title: string; value: string; icon: typeof TrendingUp; tone: "emerald" | "rose" | "blue" }) {
  const classes = {
    emerald: "border-emerald-100 text-emerald-600 bg-emerald-50",
    rose: "border-rose-100 text-rose-600 bg-rose-50",
    blue: "border-blue-100 text-primary bg-blue-50",
  };

  return (
    <Card className="flex items-start justify-between gap-3 border-slate-200/80 bg-background p-5 shadow-sm">
      <div className="min-w-0 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="break-words text-2xl font-black tracking-tight text-slate-900">{value}</div>
      </div>
      <div className={`shrink-0 rounded-xl border p-2.5 ${classes[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </Card>
  );
}

function ChartTitle({ icon: Icon, title, subtitle }: { icon: typeof Clock; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="rounded-lg bg-blue-50 p-1.5 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function PieCard({ icon, title, subtitle, data, offset }: { icon: typeof Wallet; title: string; subtitle: string; data: { name: string; value: number }[]; offset: number }) {
  return (
    <Card className="border-slate-200/80 bg-background p-5 shadow-sm">
      <ChartTitle icon={icon} title={title} subtitle={subtitle} />
      <div className="flex h-64 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={75} innerRadius={title.includes("règlement") ? 50 : undefined} paddingAngle={3}>
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[(index + offset) % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: "10px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
