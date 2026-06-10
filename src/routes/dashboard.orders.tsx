import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Banknote, Calendar, Layers, Pencil, Phone, Plus, Search, ShoppingBag, Trash2, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatXOF } from "@/services/api";
import { pressingApi } from "@/services/pressing-api";
import type { Order, OrderStatus, PaymentStatus } from "@/services/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/orders")({ component: OrdersPage });

const STATUSES: OrderStatus[] = ["Reçu", "En lavage", "En repassage", "Prêt", "Livré"];
const PAYMENTS: PaymentStatus[] = ["Payé", "Partiellement payé", "Non payé"];
const PERIODS = ["Aujourd'hui", "Cette semaine", "Ce mois", "Tout"] as const;

const statusColor: Record<OrderStatus, string> = {
  "Reçu": "bg-blue-50 text-blue-700 border-blue-200",
  "En lavage": "bg-amber-50 text-amber-700 border-amber-200",
  "En repassage": "bg-purple-50 text-purple-700 border-purple-200",
  "Prêt": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Livré": "bg-slate-100 text-slate-600 border-slate-200",
};

const payColor: Record<PaymentStatus, string> = {
  "Payé": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Partiellement payé": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Non payé": "bg-rose-50 text-rose-700 ring-rose-600/10",
};

function OrdersPage() {
  const queryClient = useQueryClient();
  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: pressingApi.orders.list,
  });
  const [filter, setFilter] = useState<OrderStatus | "Tous">("Tous");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Tout");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      list.filter(
        (order) =>
          (filter === "Tous" || order.status === filter) &&
          `${order.id} ${order.clientName} ${order.clientPhone ?? ""} ${order.items}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [list, filter, search],
  );

  const saveOrder = useMutation({
    mutationFn: (payload: { id?: string; data: FormData }) =>
      payload.id ? pressingApi.orders.update(payload.id, payload.data) : pressingApi.orders.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(editing ? "Commande mise à jour" : "Commande créée");
      setOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Impossible d'enregistrer la commande"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => pressingApi.orders.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Statut mis à jour");
    },
    onError: () => toast.error("Impossible de modifier le statut"),
  });

  const deleteOrder = useMutation({
    mutationFn: pressingApi.orders.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Commande supprimée");
    },
    onError: () => toast.error("Impossible de supprimer cette commande"),
  });

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveOrder.mutate({ id: editing?.id, data: new FormData(event.currentTarget) });
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer définitivement cette commande ?")) {
      deleteOrder.mutate(id);
    }
  };

  const emptyMessage = isLoading
    ? "Chargement des commandes..."
    : isError
      ? "Connectez votre API pour afficher les commandes."
      : "Aucune commande ne correspond aux filtres.";

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader
        title="Commandes"
        subtitle={`${list.length} fiches de traitement enregistrées`}
        actions={
          <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="h-10 gap-1.5 font-semibold shadow-md shadow-primary/10">
                <Plus className="h-4 w-4" /> Nouvelle commande
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] overflow-y-auto border-slate-200 sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing ? "Modifier la commande" : "Créer un dépôt de linge"}</DialogTitle>
                <DialogDescription>Saisissez les informations du client et les détails du linge.</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSave} className="grid gap-4 pt-2 sm:grid-cols-2">
                <Field icon={User} label="Nom du client" name="clientName" defaultValue={editing?.clientName} required />
                <Field icon={Phone} label="Téléphone" name="clientPhone" defaultValue={editing?.clientPhone} type="tel" />
                <Field icon={Layers} label="Articles déposés" name="items" defaultValue={editing?.items} required className="sm:col-span-2" />
                <Field icon={Banknote} label="Montant total (FCFA)" name="amount" defaultValue={editing?.amount} type="number" required />
                <SelectField label="État d'avancement" name="status" defaultValue={editing?.status ?? "Reçu"} values={STATUSES} />
                <SelectField label="Règlement" name="payment" defaultValue={editing?.payment ?? "Non payé"} values={PAYMENTS} />
                <Field label="Date de dépôt" name="receivedAt" defaultValue={editing?.receivedAt ?? new Date().toISOString().slice(0, 10)} type="date" required />
                <Field label="Livraison prévue" name="deliveryAt" defaultValue={editing?.deliveryAt} type="date" required />
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="attachment">Pièce jointe / photo</Label>
                  <label htmlFor="attachment" className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-500 hover:bg-slate-50">
                    <Upload className="mb-1 h-5 w-5 text-slate-400" />
                    <span>Ajouter une image ou un PDF</span>
                    {editing?.attachmentName && <span className="mt-1 max-w-xs truncate text-emerald-600">{editing.attachmentName}</span>}
                    <input id="attachment" name="attachment" type="file" className="hidden" accept="image/*,application/pdf" />
                  </label>
                </div>
                <DialogFooter className="border-t border-slate-100 pt-4 sm:col-span-2">
                  <Button type="submit" disabled={saveOrder.isPending} className="w-full">
                    {editing ? "Mettre à jour" : "Enregistrer le dépôt"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="overflow-hidden border-slate-200/80 bg-background shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher..." className="h-10 pl-9" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Select value={filter} onValueChange={(value) => setFilter(value as OrderStatus | "Tous")}>
              <SelectTrigger className="h-10 w-full bg-background sm:w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                {STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={(value) => setPeriod(value as (typeof PERIODS)[number])}>
              <SelectTrigger className="h-10 w-full bg-background sm:w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>{PERIODS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-left font-semibold">Référence</th>
                <th className="px-4 py-3 text-left font-semibold">Client</th>
                <th className="px-4 py-3 text-left font-semibold">Articles</th>
                <th className="px-4 py-3 text-left font-semibold">Montant</th>
                <th className="px-4 py-3 text-left font-semibold">Statut</th>
                <th className="px-4 py-3 text-center font-semibold">Paiement</th>
                <th className="px-4 py-3 text-left font-semibold">Livraison</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-bold text-slate-500">{order.id}</td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="font-semibold text-slate-800">{order.clientName}</span>
                    {order.clientPhone && <span className="block text-[11px] font-medium text-slate-400">{order.clientPhone}</span>}
                  </td>
                  <td className="max-w-xs px-4 py-3.5 font-medium text-slate-500">
                    <span className="block truncate">{order.items}</span>
                    {order.attachmentName && <span className="block truncate text-[10px] text-primary">{order.attachmentName}</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-900">{formatXOF(order.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <Select value={order.status} onValueChange={(value) => updateStatus.mutate({ id: order.id, status: value as OrderStatus })}>
                      <SelectTrigger className={`h-8 w-[135px] rounded-full px-3 text-xs font-bold ${statusColor[order.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>{STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-center">
                    <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${payColor[order.payment]}`}>
                      {order.payment}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs font-medium text-slate-500">
                    <Calendar className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" />
                    {order.deliveryAt}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(order); setOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-destructive" onClick={() => handleDelete(order.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {(filtered.length === 0 || isLoading || isError) && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center font-medium text-slate-400">
                    <ShoppingBag className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  className?: string;
  icon?: typeof User;
};

function Field({ label, name, defaultValue, type = "text", required, className, icon: Icon }: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        <Input id={name} name={name} type={type} required={required} defaultValue={defaultValue ?? ""} className={Icon ? "h-10 pl-9" : "h-10"} />
      </div>
    </div>
  );
}

function SelectField<T extends string>({ label, name, defaultValue, values }: { label: string; name: string; defaultValue: T; values: readonly T[] }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
        <SelectContent>{values.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}
