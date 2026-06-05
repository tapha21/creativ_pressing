import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialExpenses, formatXOF, type Expense } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/expenses")({ component: ExpensesPage });

const CATS: Expense["category"][] = ["Eau", "Électricité", "Salaires", "Produits", "Autre"];

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
    const data = { category: String(fd.get("category")) as Expense["category"], description: String(fd.get("description")), amount: Number(fd.get("amount")), date: String(fd.get("date")) };
    if (editing) { setList((l) => l.map((x) => x.id === editing.id ? { ...x, ...data } : x)); toast.success("Dépense modifiée"); }
    else { setList((l) => [{ id: `e${Date.now()}`, ...data }, ...l]); toast.success("Dépense ajoutée"); }
    setOpen(false); setEditing(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Dépenses" subtitle={`Total filtré : ${formatXOF(total)}`}
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Nouvelle dépense</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Modifier dépense" : "Nouvelle dépense"}</DialogTitle></DialogHeader>
              <form onSubmit={onSave} className="grid gap-4">
                <div className="space-y-2"><Label>Catégorie</Label>
                  <Select name="category" defaultValue={editing?.category ?? "Autre"}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="description">Description</Label><Input name="description" required defaultValue={editing?.description ?? ""} /></div>
                <div className="space-y-2"><Label htmlFor="amount">Montant</Label><Input name="amount" type="number" required defaultValue={editing?.amount ?? 0} /></div>
                <div className="space-y-2"><Label htmlFor="date">Date</Label><Input name="date" type="date" required defaultValue={editing?.date ?? new Date().toISOString().slice(0,10)} /></div>
                <DialogFooter><Button type="submit">{editing ? "Enregistrer" : "Ajouter"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <Card className="p-5">
        <div className="mb-4 flex flex-wrap gap-3">
          <Select value={filter} onValueChange={(v) => setFilter(v as Expense["category"] | "Tous")}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Toutes catégories</SelectItem>
              {CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr className="border-b"><th className="py-3 pr-4">Catégorie</th><th className="py-3 pr-4">Description</th><th className="py-3 pr-4">Montant</th><th className="py-3 pr-4">Date</th><th className="py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="py-3 pr-4"><Badge variant="secondary">{e.category}</Badge></td>
                  <td className="py-3 pr-4">{e.description}</td>
                  <td className="py-3 pr-4 font-medium">{formatXOF(e.amount)}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{e.date}</td>
                  <td className="py-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(e); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { setList((l) => l.filter((x) => x.id !== e.id)); toast.success("Supprimée"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}