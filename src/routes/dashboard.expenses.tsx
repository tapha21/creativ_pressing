import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Wallet, Tag, FileText, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialExpenses, formatXOF, type Expense } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/expenses")({ component: ExpensesPage });

const CATS: Expense["category"][] = ["Eau", "Électricité", "Salaires", "Produits", "Autre"];

// 🎨 Palette sémantique pour distinguer instantanément les charges de l'entreprise
const catStyles: Record<Expense["category"], string> = {
  "Eau": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Électricité": "bg-amber-50 text-amber-700 border-amber-200",
  "Salaires": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Produits": "bg-purple-50 text-purple-700 border-purple-200",
  "Autre": "bg-slate-50 text-slate-600 border-slate-200",
};

function ExpensesPage() {
  const [list, setList] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<Expense["category"] | "Tous">("Tous");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const filtered = useMemo(() => list.filter((e) => filter === "Tous" || e.category === filter), [list, filter]);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { 
      category: String(fd.get("category")) as Expense["category"], 
      description: String(fd.get("description")), 
      amount: Number(fd.get("amount")), 
      date: String(fd.get("date")) 
    };

    if (editing) { 
      setList((l) => l.map((x) => x.id === editing.id ? { ...x, ...data } : x)); 
      toast.success("Sortie de caisse modifiée"); 
    } else { 
      setList((l) => [{ id: `e${Date.now()}`, ...data }, ...l]); 
      toast.success("Dépense enregistrée dans les comptes"); 
    }
    setOpen(false); 
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette écriture comptable ? Cela modifiera vos calculs de rentabilité.")) {
      setList((l) => l.filter((x) => x.id !== id));
      toast.success("Écriture supprimée");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader 
        title="Dépenses & Charges" 
        subtitle="Suivi rigoureux des sorties de trésorerie"
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="shadow-md shadow-primary/10 gap-1.5 font-semibold h-10">
                <Plus className="h-4 w-4" /> Nouvelle dépense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {editing ? "Modifier la ligne de frais" : "Enregistrer une dépense"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Attribuez un montant et une catégorie claire pour optimiser votre comptabilité.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={onSave} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Type de charge</Label>
                  <Select name="category" defaultValue={editing?.category ?? "Autre"}>
                    <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Libellé / Justificatif</Label>
                  <div className="relative group">
                    <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="description" name="description" required defaultValue={editing?.description ?? ""} placeholder="Ex: Achat bidons de lessive 20L" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount" className="text-xs font-semibold text-slate-700">Montant payé (FCFA)</Label>
                    <div className="relative group">
                      <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input id="amount" name="amount" type="number" required defaultValue={editing?.amount ?? ""} placeholder="0" className="pl-9 h-10 border-slate-200" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-xs font-semibold text-slate-700">Date du règlement</Label>
                    <Input id="date" name="date" type="date" required defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)} className="h-10 border-slate-200" />
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-slate-100">
                  <Button type="submit" className="w-full font-semibold">
                    {editing ? "Enregistrer les modifications" : "Valider la sortie d'argent"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* 📊 Section d'en-tête dynamique (KPI Card & Filtres déportés pour aérer) */}
      <div className="grid gap-4 sm:grid-cols-4 items-center">
        <Card className="p-4 border-slate-200/80 shadow-sm bg-background col-span-1 sm:col-span-2 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total des charges filtrées</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">{formatXOF(total)}</p>
          </div>
        </Card>

        <div className="col-span-1 sm:col-span-2 flex justify-end">
          <div className="relative w-full sm:w-[220px] group">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Select value={filter} onValueChange={(v) => setFilter(v as Expense["category"] | "Tous")}>
              <SelectTrigger className="pl-9 h-11 border-slate-200 bg-background shadow-sm text-slate-700 font-medium"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Toutes catégories</SelectItem>
                {CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 📋 Liste des transactions */}
      <Card className="border-slate-200/80 shadow-sm overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-medium text-xs uppercase tracking-wider">
                <th className="py-3 px-6 text-left font-semibold">Catégorie</th>
                <th className="py-3 px-6 text-left font-semibold">Libellé / Nature du frais</th>
                <th className="py-3 px-6 text-left font-semibold">Montant engagé</th>
                <th className="py-3 px-6 text-left font-semibold">Période</th>
                <th className="py-3 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60 transition-colors group">
                  
                  {/* Badge Typé */}
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <Badge variant="outline" className={`px-2.5 py-0.5 font-bold rounded-full text-[11px] ${catStyles[e.category]}`}>
                      {e.category}
                    </Badge>
                  </td>

                  {/* Description descriptive */}
                  <td className="py-3.5 px-6 font-semibold text-slate-800">
                    {e.description}
                  </td>

                  {/* Montant Négatif / Sortie de fonds (Coloré subtilement) */}
                  <td className="py-3.5 px-6 whitespace-nowrap font-bold text-rose-600">
                    - {formatXOF(e.amount)}
                  </td>

                  {/* Date de facture */}
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{e.date}</span>
                    </div>
                  </td>

                  {/* Boutons d'édition */}
                  <td className="py-3.5 px-6 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Corriger la dépense"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => { setEditing(e); setOpen(true); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        title="Effacer le registre"
                        className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(e.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tag className="h-6 w-6 text-slate-300" />
                      <span>Aucune ligne de dépense enregistrée dans cette catégorie</span>
                    </div>
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