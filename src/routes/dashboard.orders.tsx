import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, ShoppingBag, User, Layers, Banknote, Calendar, Phone, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialOrders, formatXOF, type Order, type OrderStatus, type PaymentStatus } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/orders")({ component: OrdersPage });

const STATUSES: OrderStatus[] = ["Reçu", "En lavage", "En repassage", "Prêt", "Livré"];
const PAYMENTS: PaymentStatus[] = ["Payé", "Partiellement payé", "Non payé"];
const PERIODS = ["Aujourd'hui", "Cette semaine", "Ce mois", "Tout"] as const;

const statusColor: Record<OrderStatus, string> = {
  "Reçu": "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80",
  "En lavage": "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/80",
  "En repassage": "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/80",
  "Prêt": "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/80",
  "Livré": "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80",
};

const payColor: Record<PaymentStatus, string> = {
  "Payé": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "Partiellement payé": "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Non payé": "bg-rose-50 text-rose-700 ring-rose-600/10",
};

function OrdersPage() {
  const [list, setList] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "Tous">("Tous");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Tout");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null); // Remplacé par any temporairement pour le numéro/fichier

  const filtered = useMemo(
    () => list.filter((o) =>
      (filter === "Tous" || o.status === filter) &&
      `${o.id} ${o.clientName} ${o.clientPhone ?? ""} ${o.items}`.toLowerCase().includes(search.toLowerCase())
    ),
    [list, filter, search]
  );

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    // Récupération du fichier
    const file = fd.get("attachment") as File;

    const data = {
      clientName: String(fd.get("clientName")),
      clientPhone: String(fd.get("clientPhone") || ""), // Optionnel si déjà client régulier
      items: String(fd.get("items")),
      amount: Number(fd.get("amount") || 0),
      status: String(fd.get("status")) as OrderStatus,
      payment: String(fd.get("payment")) as PaymentStatus,
      receivedAt: String(fd.get("receivedAt")),
      deliveryAt: String(fd.get("deliveryAt")),
      attachmentName: file && file.size > 0 ? file.name : (editing?.attachmentName ?? null)
    };

    if (editing) {
      setList((l) => l.map((o) => (o.id === editing.id ? { ...o, ...data } : o)));
      toast.success("Détails de la commande actualisés");
    } else {
      const id = `CMD-${1050 + list.length}`;
      setList((l) => [{ id, clientId: "c1", ...data }, ...l]);
      toast.success("Nouvelle commande créée avec succès");
    }
    setOpen(false); 
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer définitivement cette commande ? Cette action annulera le suivi de ses articles.")) {
      setList((l) => l.filter((x) => x.id !== id));
      toast.success("Commande archivée / supprimée");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader 
        title="Commandes" 
        subtitle={`${list.length} fiches de traitement enregistrées`}
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="shadow-md shadow-primary/10 gap-1.5 font-semibold h-10">
                <Plus className="h-4 w-4" /> Nouvelle commande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg border-slate-200 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {editing ? "Modifier la commande" : "Créer un dépôt de linge"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Saisissez les informations du client (avec ou sans compte) et les détails du linge.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2 pt-2">
                {/* Section Client Sans Compte / Avec Compte */}
                <div className="space-y-1.5">
                  <Label htmlFor="clientName" className="text-xs font-semibold text-slate-700">Nom du client</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="clientName" name="clientName" required defaultValue={editing?.clientName ?? ""} placeholder="Ex: Amadou Diop" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="clientPhone" className="text-xs font-semibold text-slate-700">Numéro de téléphone</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="clientPhone" name="clientPhone" type="tel" defaultValue={editing?.clientPhone ?? ""} placeholder="Ex: 77 XXX XX XX" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="items" className="text-xs font-semibold text-slate-700">Détail des articles</Label>
                  <div className="relative group">
                    <Layers className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="items" name="items" required defaultValue={editing?.items ?? ""} placeholder="Ex: 3 Boubous, 2 Vestes, 1 Rideau" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="amount" className="text-xs font-semibold text-slate-700">Montant total (FCFA)</Label>
                  <div className="relative group">
                    <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="amount" name="amount" type="number" required defaultValue={editing?.amount ?? ""} placeholder="0" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">État d'avancement</Label>
                  <Select name="status" defaultValue={editing?.status ?? "Reçu"}>
                    <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Règlement caisse</Label>
                  <Select name="payment" defaultValue={editing?.payment ?? "Non payé"}>
                    <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>{PAYMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="receivedAt" className="text-xs font-semibold text-slate-700">Date de dépôt</Label>
                  <Input id="receivedAt" name="receivedAt" type="date" required defaultValue={editing?.receivedAt ?? new Date().toISOString().slice(0, 10)} className="h-10 border-slate-200" />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="deliveryAt" className="text-xs font-semibold text-slate-700">Date de livraison prévue</Label>
                  <Input id="deliveryAt" name="deliveryAt" type="date" required defaultValue={editing?.deliveryAt ?? ""} className="h-10 border-slate-200" />
                </div>

                {/* Nouveau champ : Upload de fichier (Photo du linge ou reçu) */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="attachment" className="text-xs font-semibold text-slate-700">Pièce jointe / Photo du linge</Label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="attachment" className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        <Upload className="w-5 h-5 mb-1 text-slate-400" />
                        <p className="text-xs text-slate-500 font-medium">
                          <span className="font-semibold text-primary">Cliquez pour uploader</span> ou glissez un fichier
                        </p>
                        {editing?.attachmentName && (
                          <p className="text-[10px] text-emerald-600 mt-1 truncate max-w-xs">Fichier actuel : {editing.attachmentName}</p>
                        )}
                      </div>
                      <input id="attachment" name="attachment" type="file" className="hidden" accept="image/*,application/pdf" />
                    </label>
                  </div>
                </div>

                <DialogFooter className="sm:col-span-2 pt-4 border-t border-slate-100">
                  <Button type="submit" className="w-full font-semibold">{editing ? "Mettre à jour la commande" : "Enregistrer le dépôt"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-slate-200/80 shadow-sm overflow-hidden bg-background">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px] max-w-sm group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Rechercher un numéro, un client, un habit..." 
              className="pl-9 h-10 bg-background border-slate-200 shadow-sm text-sm" 
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={(v) => setFilter(v as OrderStatus | "Tous")}>
              <SelectTrigger className="w-[160px] h-10 border-slate-200 bg-background"><SelectValue placeholder="Filtrer l'état" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={(v) => setPeriod(v as (typeof PERIODS)[number])}>
              <SelectTrigger className="w-[150px] h-10 border-slate-200 bg-background"><SelectValue placeholder="Période" /></SelectTrigger>
              <SelectContent>{PERIODS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium text-xs uppercase tracking-wider">
                <th className="py-3 px-6 text-left font-semibold">Référence</th>
                <th className="py-3 px-6 text-left font-semibold">Client</th>
                <th className="py-3 px-6 text-left font-semibold">Articles déposés</th>
                <th className="py-3 px-6 text-left font-semibold">Net à payer</th>
                <th className="py-3 px-6 text-left font-semibold">Statut Traitement</th>
                <th className="py-3 px-6 text-center font-semibold">Paiement</th>
                <th className="py-3 px-6 text-left font-semibold">Livraison</th>
                <th className="py-3 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((o: any) => (
                <tr key={o.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="py-3.5 px-6 whitespace-nowrap font-mono text-xs font-bold text-slate-500">
                    {o.id}
                  </td>

                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{o.clientName}</span>
                      {o.clientPhone && (
                        <span className="text-[11px] text-slate-400 font-medium font-mono">{o.clientPhone}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-6 text-slate-500 max-w-xs truncate font-medium">
                    <div className="flex flex-col gap-0.5">
                      <span>{o.items}</span>
                      {o.attachmentName && (
                        <span className="text-[10px] text-primary underline cursor-pointer truncate max-w-[180px]">📎 {o.attachmentName}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-6 whitespace-nowrap font-bold text-slate-900">
                    {formatXOF(o.amount)}
                  </td>

                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <Select 
                      value={o.status} 
                      onValueChange={(v) => { 
                        setList((l) => l.map((x) => x.id === o.id ? { ...x, status: v as OrderStatus } : x)); 
                        toast.success(`Commande passée en statut "${v}"`); 
                      }}
                    >
                      <SelectTrigger className={`h-8 w-[135px] text-xs font-bold rounded-full border shadow-sm transition-all px-3 ${statusColor[o.status]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs font-medium">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>

                  <td className="py-3.5 px-6 whitespace-nowrap text-center">
                    <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${payColor[o.payment]}`}>
                      {o.payment}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{o.deliveryAt}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Éditer la commande"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => { setEditing(o); setOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Archiver"
                        className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(o.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShoppingBag className="h-6 w-6 text-slate-300" />
                      <span>Aucune commande ne correspond aux filtres appliqués</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 w-fit">
        <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
        <span>**Astuce de productivité :** La recherche globale filtre aussi par numéro de téléphone ! Pratique pour retrouver un client rapidement.</span>
      </div>
    </div>
  );
}