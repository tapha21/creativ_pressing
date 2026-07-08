import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Ban, Building2, CalendarClock, CheckCircle2, Clock3, Crown, Mail, MapPin, Phone, Search, ShieldAlert, ShoppingBag, Sparkles, Store, UserPlus, Users, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatXOF } from "@/services/api";
import { pressingApi } from "@/services/pressing-api";
import type { Shop } from "@/services/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({ component: AdminIndexPage });

const STATUSES = ["Essai", "Actif", "Expire", "Suspendu"] as const;
const PLANS = ["Basic", "Standard", "Premium"] as const;

const statusColor: Record<string, string> = {
  Essai: "bg-amber-50 text-amber-700 border-amber-200",
  Actif: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Expire: "bg-rose-50 text-rose-700 border-rose-200",
  Suspendu: "bg-slate-100 text-slate-600 border-slate-200",
};

function AdminIndexPage() {
  const queryClient = useQueryClient();
  const { data: shops = [], isLoading, isError } = useQuery({
    queryKey: ["shops"],
    queryFn: () => pressingApi.shops.list(),
  });
  const { data: platformStats } = useQuery({
    queryKey: ["shops-stats"],
    queryFn: pressingApi.shops.stats,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tous");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["shops"] });

  const updateSubscription = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, string | null> }) =>
      pressingApi.shops.updateSubscription(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Abonnement mis à jour");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Mise à jour impossible"),
  });

  const setActive = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => pressingApi.shops.setActive(id, active),
    onSuccess: (_data, variables) => {
      invalidate();
      toast.success(variables.active ? "Société débloquée" : "Société bloquée");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Action impossible"),
  });

  const counts = useMemo(() => {
    return {
      total: shops.length,
      essai: shops.filter((s) => s.subscriptionStatus === "Essai").length,
      actif: shops.filter((s) => s.subscriptionStatus === "Actif").length,
      expire: shops.filter((s) => s.subscriptionStatus === "Expire").length,
      bloque: shops.filter((s) => !s.active).length,
    };
  }, [shops]);

  const insights = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      basic: shops.filter((s) => s.subscriptionPlan === "Basic").length,
      standard: shops.filter((s) => s.subscriptionPlan === "Standard").length,
      premium: shops.filter((s) => s.subscriptionPlan === "Premium").length,
      newThisWeek: shops.filter((s) => new Date(s.createdAt).getTime() >= weekAgo).length,
      cities: new Set(shops.map((s) => s.city).filter(Boolean)).size,
    };
  }, [shops]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return shops.filter((shop) => {
      const matchesStatus = statusFilter === "Tous" || shop.subscriptionStatus === statusFilter;
      const matchesSearch =
        !term ||
        `${shop.name} ${shop.ownerName} ${shop.email} ${shop.city}`.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [shops, search, statusFilter]);

  const emptyMessage = isLoading
    ? "Chargement des sociétés..."
    : isError
      ? "Impossible de charger la liste des sociétés."
      : "Aucune société ne correspond à ce filtre.";

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Sociétés & abonnements" subtitle={`${counts.total} pressings inscrits sur la plateforme`} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Building2} label="Total" value={counts.total} />
        <StatCard icon={Clock3} label="En essai" value={counts.essai} accent="text-amber-600 bg-amber-50" onClick={() => setStatusFilter("Essai")} />
        <StatCard icon={CheckCircle2} label="Actifs" value={counts.actif} accent="text-emerald-600 bg-emerald-50" onClick={() => setStatusFilter("Actif")} />
        <StatCard icon={CalendarClock} label="Expirés" value={counts.expire} accent="text-rose-600 bg-rose-50" onClick={() => setStatusFilter("Expire")} />
        <StatCard icon={ShieldAlert} label="Bloqués" value={counts.bloque} accent="text-slate-600 bg-slate-100" />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-black tracking-tight text-slate-900">KPI plateforme</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard icon={Users} label="Clients (tous pressings)" value={platformStats?.totalClients ?? 0} accent="text-blue-600 bg-blue-50" />
          <StatCard icon={ShoppingBag} label="Commandes (tous pressings)" value={platformStats?.totalOrders ?? 0} accent="text-indigo-600 bg-indigo-50" />
          <StatCard icon={Wallet} label="CA plateforme (mois)" value={formatXOF(platformStats?.monthlyRevenue ?? 0)} accent="text-emerald-600 bg-emerald-50" />
          <StatCard icon={UserPlus} label="Nouveaux (7 jours)" value={insights.newThisWeek} accent="text-amber-600 bg-amber-50" />
          <StatCard icon={MapPin} label="Villes couvertes" value={insights.cities} accent="text-purple-600 bg-purple-50" />
        </div>
      </div>

      <Card className="border-slate-200/80 bg-background p-4 shadow-sm">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Répartition par offre</h3>
        <div className="grid grid-cols-3 gap-3">
          <PlanBar icon={Sparkles} label="Basic" value={insights.basic} total={counts.total} tone="bg-blue-500" />
          <PlanBar icon={Crown} label="Standard" value={insights.standard} total={counts.total} tone="bg-emerald-500" />
          <PlanBar icon={Crown} label="Premium" value={insights.premium} total={counts.total} tone="bg-amber-500" />
        </div>
      </Card>

      <Card className="border-slate-200/80 bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Rechercher un pressing, un propriétaire, une ville..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["Tous", ...STATUSES] as const).map((status) => (
              <Button
                key={status}
                type="button"
                size="sm"
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
                className="h-8 text-xs font-semibold"
              >
                {status === "Tous" ? "Tous" : status}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-slate-200/80 bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Société</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Offre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead className="text-right">Accès</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((shop) => (
              <ShopRow
                key={shop.id}
                shop={shop}
                onSubscriptionChange={(payload) => updateSubscription.mutate({ id: shop.id, payload })}
                onToggleActive={() => setActive.mutate({ id: shop.id, active: !shop.active })}
                pending={updateSubscription.isPending || setActive.isPending}
              />
            ))}
          </TableBody>
        </Table>

        {(filtered.length === 0 || isLoading || isError) && (
          <div className="border-t-0 p-12 text-center text-slate-400">
            <Store className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="font-medium">{emptyMessage}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = "text-slate-600 bg-slate-100",
  onClick,
}: {
  icon: typeof Building2;
  label: string;
  value: number | string;
  accent?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`border-slate-200/80 bg-background p-4 shadow-sm ${onClick ? "cursor-pointer transition-transform hover:-translate-y-0.5" : ""}`}
    >
      <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="truncate text-2xl font-black tracking-tight text-slate-900">{value}</div>
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
    </Card>
  );
}

function PlanBar({
  icon: Icon,
  label,
  value,
  total,
  tone,
}: {
  icon: typeof Sparkles;
  label: string;
  value: number;
  total: number;
  tone: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-slate-400" /> {label}
        </span>
        <span>{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ShopRow({
  shop,
  onSubscriptionChange,
  onToggleActive,
  pending,
}: {
  shop: Shop;
  onSubscriptionChange: (payload: Record<string, string | null>) => void;
  onToggleActive: () => void;
  pending: boolean;
}) {
  return (
    <TableRow className={!shop.active ? "bg-rose-50/40" : undefined}>
      <TableCell className="min-w-[180px]">
        <div className="font-bold text-slate-900">{shop.name}</div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {shop.city}
        </div>
      </TableCell>
      <TableCell className="min-w-[200px]">
        <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
          <Phone className="h-3 w-3 text-slate-400" /> {shop.phone}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="h-3 w-3" /> {shop.email}
        </div>
      </TableCell>
      <TableCell className="min-w-[130px]">
        <Select
          value={shop.subscriptionPlan}
          onValueChange={(value) => onSubscriptionChange({ subscriptionPlan: value })}
          disabled={pending}
        >
          <SelectTrigger className="h-9 text-xs font-semibold"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PLANS.map((plan) => (
              <SelectItem key={plan} value={plan}>{plan}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="min-w-[150px]">
        <div className="space-y-1.5">
          <Select
            value={shop.subscriptionStatus}
            onValueChange={(value) => onSubscriptionChange({ subscriptionStatus: value })}
            disabled={pending}
          >
            <SelectTrigger className="h-9 text-xs font-semibold"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className={`w-fit ${statusColor[shop.subscriptionStatus] ?? ""}`}>
            {shop.subscriptionStatus}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="min-w-[160px]">
        {shop.subscriptionStatus === "Essai" ? (
          <div className="text-xs font-medium text-muted-foreground">Essai jusqu'au {shop.trialEndsAt ?? "-"}</div>
        ) : (
          <Input
            type="date"
            defaultValue={shop.subscriptionEndsAt ?? ""}
            onBlur={(event) => {
              if (event.target.value && event.target.value !== shop.subscriptionEndsAt) {
                onSubscriptionChange({ subscriptionEndsAt: event.target.value });
              }
            }}
            disabled={pending}
            className="h-9 text-xs"
          />
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          type="button"
          size="sm"
          variant={shop.active ? "outline" : "default"}
          disabled={pending}
          onClick={onToggleActive}
          className={`h-8 gap-1.5 text-xs font-semibold ${shop.active ? "text-rose-600 hover:bg-rose-50" : "bg-emerald-600 hover:bg-emerald-700"}`}
        >
          {shop.active ? (
            <>
              <Ban className="h-3.5 w-3.5" /> Bloquer
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" /> Débloquer
            </>
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
}
