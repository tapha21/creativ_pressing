import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { 
  TrendingUp, 
  ArrowDownRight, 
  Sparkles, 
  PieChart as PieIcon, 
  BarChart3, 
  LineChart as LineIcon, 
  Calendar, 
  Users, 
  Clock, 
  Wallet, 
  Shirt 
} from "lucide-react";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Area, 
  AreaChart 
} from "recharts";
import { revenueChartData, formatXOF } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/reports")({ component: ReportsPage });

// 📊 Jeux de données simulés (Mock Data)
const profit = revenueChartData.map((r) => ({ 
  month: r.month, 
  benefice: r.revenu - r.depenses 
}));

const breakdown = [
  { name: "Salaires", value: 180000 },
  { name: "Électricité", value: 65000 },
  { name: "Produits", value: 53000 },
  { name: "Eau", value: 12000 },
];

// 1. Performance des employés (Commandes gérées)
const employeeData = [
  { name: "Fatou Diop", commandes: 145, CA: 450000 },
  { name: "Moussa Ndiaye", commandes: 112, CA: 320000 },
  { name: "Awa Seydi", commandes: 98, CA: 280000 },
];

// 2. Volume de commandes par tranche horaire (Heures de pointe)
const hourlyData = [
  { heure: "08h - 10h", commandes: 45 },
  { heure: "10h - 12h", commandes: 30 },
  { heure: "12h - 14h", commandes: 15 },
  { heure: "14h - 16h", commandes: 25 },
  { heure: "16h - 18h", commandes: 85 }, // Fin de journée de bureau
  { heure: "18h - 20h", commandes: 110 }, // Heure de pointe maximale
];

// 3. Modes de paiement plébiscités
const paymentMethods = [
  { name: "Wave", value: 340000 },
  { name: "Espèces", value: 250000 },
  { name: "Orange Money", value: 130000 },
];

// 4. Top Articles traités
const topItems = [
  { name: "Boubous / Objets Traditionnels", value: 40 },
  { name: "Costumes / Vestes", value: 30 },
  { name: "Draps / Couettes", value: 18 },
  { name: "Chemises / T-shirts", value: 12 },
];

const CHART_COLORS = ["#2563eb", "#f59e0b", "#8b5cf6", "#06b6d4", "#10b981", "#f43f5e"];

// 🎨 Infobulle intelligente adaptative (Détecte s'il faut formater en FCFA ou afficher une quantité brute)
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-slate-200 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs font-medium space-y-1">
        <p className="text-slate-400 font-bold tracking-wide uppercase text-[10px] flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {label}
        </p>
        {payload.map((item: any, idx: number) => {
          const isQuantity = item.name.toLowerCase().includes("commande") || item.name.toLowerCase().includes("vêtement") || item.name.toLowerCase().includes("part");
          return (
            <p key={idx} style={{ color: item.color || item.fill }} className="text-sm font-black tracking-tight">
              {item.name} : {isQuantity ? `${item.value} unités` : formatXOF(item.value)}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

function ReportsPage() {
  return (
    <div className="animate-fade-in space-y-6 text-slate-900 antialiased pb-12">
      {/* En-tête de la page */}
      <PageHeader 
        title="Rapports & Analyses" 
        subtitle="Performance, affluence horaire et productivité de votre équipe" 
        actions={
          <Badge variant="outline" className="px-3 py-1 font-semibold border-slate-300 text-slate-600 bg-slate-50 gap-1.5 rounded-full text-xs shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Exercice en cours
          </Badge>
        } 
      />

      {/* 📈 Section Cartes KPI principales */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 border-emerald-100 shadow-sm bg-background flex justify-between items-start group hover:border-emerald-200 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chiffre d'affaires</span>
            <div className="text-2xl font-black text-emerald-600 tracking-tight">{formatXOF(720000)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <TrendingUp className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-5 border-rose-100 shadow-sm bg-background flex justify-between items-start group hover:border-rose-200 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Charges & Dépenses</span>
            <div className="text-2xl font-black text-rose-600 tracking-tight">{formatXOF(310000)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-5 border-blue-100 shadow-sm bg-background flex justify-between items-start group hover:border-blue-200 transition-colors">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Résultat Net (Bénéfice)</span>
            <div className="text-2xl font-black text-primary tracking-tight">{formatXOF(410000)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-primary border border-blue-100">
            <Sparkles className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* 🕒 NOUVEAU : Analyse de l'Affluence Horaire (Heures de pointe) */}
      <Card className="p-5 border-slate-200/80 shadow-sm bg-background">
        <div className="mb-4 flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 tracking-tight">Affluence et Heures de pointe</h3>
            <p className="text-xs text-muted-foreground">Volume de dépôts/retraits de linge selon l'heure de la journée</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommandes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="heure" fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
              <YAxis fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" name="Commandes" dataKey="commandes" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCommandes)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 👥 NOUVEAU : Performance des Employés */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5 border-slate-200/80 shadow-sm bg-background">
          <div className="mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-primary">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">Classement d'activité du personnel</h3>
              <p className="text-xs text-muted-foreground">Volume de fiches gérées et enregistrées par agent</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar name="Commandes enregistrées" dataKey="commandes" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 💳 NOUVEAU : Répartition des Moyens de Paiement */}
        <Card className="p-5 border-slate-200/80 shadow-sm bg-background">
          <div className="mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">Canaux de règlement privilégiés</h3>
              <p className="text-xs text-muted-foreground">Répartition financière selon le mode de paiement utilisé</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={paymentMethods} 
                  dataKey="value" 
                  nameKey="name" 
                  outerRadius={75} 
                  innerRadius={50} 
                  paddingAngle={4}
                >
                  {paymentMethods.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(i + 2) % CHART_COLORS.length]} className="focus:outline-none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 📊 Ancienne Grille Adaptée : Évolution financière & Catégories de vêtements */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Évolution du bénéfice net (Ligne) */}
        <Card className="p-5 border-slate-200/80 shadow-sm bg-background">
          <div className="mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <LineIcon className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-slate-900 tracking-tight">Évolution du bénéfice net mensuel</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profit} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={11} fontWeight={600} stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" name="Bénéfice" dataKey="benefice" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* NOUVEAU : Top Vêtements Traités */}
        <Card className="p-5 border-slate-200/80 shadow-sm bg-background">
          <div className="mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
              <Shirt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">Top Catégories de Vêtements</h3>
              <p className="text-xs text-muted-foreground">Pourcentage de la typologie des pièces déposées en magasin</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={topItems} 
                  dataKey="value" 
                  nameKey="name" 
                  outerRadius={75} 
                  paddingAngle={2}
                >
                  {topItems.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(i + 1) % CHART_COLORS.length]} className="focus:outline-none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}