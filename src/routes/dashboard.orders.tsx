import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialOrders, formatXOF, type Order, type OrderStatus, type PaymentStatus } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/orders")({ component: OrdersPage });

const STATUSES: OrderStatus[] = ["Reçu", "En lavage", "En repassage", "Prêt", "Livré"];
const PAYMENTS: PaymentStatus[] = ["Payé", "Partiellement payé", "Non payé"];
const PERIODS = ["Aujourd'hui", "Cette semaine", "Ce mois", "Tout"] as const;

const statusColor: Record<OrderStatus, string> = {
  "Reçu": "bg-blue-100 text-blue-700",
  "En lavage": "bg-amber-100 text-amber-700",
  "En repassage": "bg-purple-100 text-purple-700",
  "Prêt": "bg-emerald-100 text-emerald-700",
  "Livré": "bg-muted text-muted-foreground",
};
const payColor: Record<PaymentStatus, string> = {
  "Payé": "bg-emerald-100 text-emerald-700",
  "Partiellement payé": "bg-amber-100 text-amber-700",
  "Non payé": "bg-rose-100 text-rose-700",
};

function OrdersPage() {
  const [list, setList] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "Tous">("Tous");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Tout");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);

  const filtered = useMemo(
    () => list.filter((o) =>
      (filter === "Tous" || o.status === filter) &&
      `${o.id} ${o.clientName} ${o.items}`.toLowerCase().includes(search.toLowerCase())
    ),
    [list, filter, search]
  );

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      clientName: String(fd.get("clientName")),
      items: String(fd.get("items")),
      amount: Number(fd.get("amount") || 0),
      status: String(fd.get("status")) as OrderStatus,
      payment: String(fd.get("payment")) as PaymentStatus,
      receivedAt: String(fd.get("receivedAt")),
      deliveryAt: String(fd.get("deliveryAt")),
    };
    if (editing) {
      setList((l) => l.map((o) => (o.id === editing.id ? { ...o, ...data } : o)));
      toast.success("Commande modifiée");
    } else {
      const id = `CMD-${1050 + list.length}`;
      setList((l) => [{ id, clientId: "c1", ...data }, ...l]);
      toast.success("Commande créée");
    }
    setOpen(false); setEditing(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Commandes" subtitle={`${list.length} commandes au total`}
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Nouvelle commande</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editing ? "Modifier commande" : "Nouvelle commande"}</DialogTitle></DialogHeader>
              <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="clientName">Client</Label><Input name="clientName" required defaultValue={editing?.clientName ?? ""} /></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="items">Articles</Label><Input name="items" required defaultValue={editing?.items ?? ""} /></div>
                <div className="space-y-2"><Label htmlFor="amount">Montant (FCFA)</Label><Input name="amount" type="number" required defaultValue={editing?.amount ?? 0} /></div>
                <div className="space-y-2"><Label>Statut</Label>
                  <Select name="status" defaultValue={editing?.status ?? "Reçu"}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Paiement</Label>
                  <Select name="payment" defaultValue={editing?.payment ?? "Non payé"}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PAYMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="receivedAt">Reçu le</Label><Input name="receivedAt" type="date" required defaultValue={editing?.receivedAt ?? new Date().toISOString().slice(0,10)} /></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="deliveryAt">Livraison</Label><Input name="deliveryAt" type="date" required defaultValue={editing?.deliveryAt ?? ""} /></div>
                <DialogFooter className="sm:col-span-2"><Button type="submit">{editing ? "Enregistrer" : "Créer"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <Card className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="pl-9" />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as OrderStatus | "Tous")}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous statuts</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={(v) => setPeriod(v as (typeof PERIODS)[number])}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{PERIODS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr className="border-b"><th className="py-3 pr-4">N°</th><th className="py-3 pr-4">Client</th><th className="py-3 pr-4">Articles</th><th className="py-3 pr-4">Montant</th><th className="py-3 pr-4">Statut</th><th className="py-3 pr-4">Paiement</th><th className="py-3 pr-4">Livraison</th><th className="py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="py-3 pr-4 font-medium">{o.id}</td>
                  <td className="py-3 pr-4">{o.clientName}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{o.items}</td>
                  <td className="py-3 pr-4 font-medium">{formatXOF(o.amount)}</td>
                  <td className="py-3 pr-4">
                    <Select value={o.status} onValueChange={(v) => { setList((l) => l.map((x) => x.id === o.id ? { ...x, status: v as OrderStatus } : x)); toast.success("Statut mis à jour"); }}>
                      <SelectTrigger className="h-7 w-[140px] px-2 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 pr-4"><Badge variant="secondary" className={payColor[o.payment]}>{o.payment}</Badge></td>
                  <td className="py-3 pr-4 text-muted-foreground">{o.deliveryAt}</td>
                  <td className="py-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(o); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { setList((l) => l.filter((x) => x.id !== o.id)); toast.success("Commande supprimée"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">Aucune commande</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-3 hidden sm:block text-xs text-muted-foreground">{statusColor && `Astuce : changez directement le statut via la liste déroulante.`}</div>
      </Card>
    </div>
  );
}