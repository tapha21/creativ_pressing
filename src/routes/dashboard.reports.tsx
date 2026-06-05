import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { revenueChartData, formatXOF } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/reports")({ component: ReportsPage });

const profit = revenueChartData.map((r) => ({ month: r.month, benefice: r.revenu - r.depenses }));
const breakdown = [
  { name: "Salaires", value: 180000 },
  { name: "Électricité", value: 65000 },
  { name: "Produits", value: 53000 },
  { name: "Eau", value: 12000 },
];
const COLORS = ["oklch(0.55 0.21 263)", "oklch(0.7 0.18 245)", "oklch(0.65 0.18 200)", "oklch(0.75 0.15 220)"];

function ReportsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Rapports" subtitle="Performance financière de votre activité" actions={<Badge variant="outline">Ce mois</Badge>} />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { l: "Revenus", v: formatXOF(720000), c: "text-emerald-600" },
          { l: "Dépenses", v: formatXOF(310000), c: "text-rose-600" },
          { l: "Bénéfices", v: formatXOF(410000), c: "text-primary" },
        ].map((k) => (
          <Card key={k.l} className="p-5">
            <div className="text-sm text-muted-foreground">{k.l}</div>
            <div className={`mt-2 text-2xl font-bold ${k.c}`}>{k.v}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="mb-4 font-semibold">Bénéfices mensuels</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profit}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 255)" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="benefice" stroke="oklch(0.55 0.21 263)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Revenus mensuels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.015 255)" />
                <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
                <Bar dataKey="revenu" fill="oklch(0.55 0.21 263)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">Répartition des dépenses</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" outerRadius={90} label>
                  {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}