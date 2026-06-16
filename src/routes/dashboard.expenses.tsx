import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Calendar, FileText, Filter, Pencil, Plus, Tag, Trash2, Wallet } from "lucide-react";
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
import type { Expense } from "@/services/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/expenses")({ component: ExpensesPage });

const CATS: Expense["category"][] = ["Eau", "Électricité", "Salaires", "Produits", "Autre"];
const catStyles: Record<Expense["category"], string> = {
  Eau: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Électricité: "bg-amber-50 text-amber-700 border-amber-200",
  Salaires: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Produits: "bg-purple-50 text-purple-700 border-purple-200",
  Autre: "bg-slate-50 text-slate-600 border-slate-200",
};

function ExpensesPage() {
  const queryClient = useQueryClient();
  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ["expenses"],
    queryFn: pressingApi.expenses.list,
  });
  const [filter, setFilter] = useState<Expense["category"] | "Tous">("Tous");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const filtered = useMemo(() => list.filter((expense) => filter === "Tous" || expense.category === filter), [list, filter]);
  const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);

  const saveExpense = useMutation({
    mutationFn: (payload: { id?: string; data: Omit<Expense, "id"> }) =>
      payload.id ? pressingApi.expenses.update(payload.id, payload.data) : pressingApi.expenses.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(editing ? "Dépense modifiée" : "Dépense enregistrée");
      setOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Impossible d'enregistrer la dépense"),
  });

  const deleteExpense = useMutation({
    mutationFn: pressingApi.expenses.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Dépense supprimée");
    },
    onError: () => toast.error("Impossible de supprimer cette dépense"),
  });

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    saveExpense.mutate({
      id: editing?.id,
      data: {
        category: String(formData.get("category")) as Expense["category"],
        description: String(formData.get("description")),
        amount: Number(formData.get("amount") || 0),
        date: String(formData.get("date")),
      },
    });
  };

  const emptyMessage = isLoading
    ? "Chargement des dépenses..."
    : isError
      ? "Connectez votre API pour afficher les dépenses."
      : "Aucune ligne de dépense enregistrée dans cette catégorie.";

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader
        title="Dépenses & Charges"
        subtitle="Suivi rigoureux des sorties de trésorerie"
        actions={
          <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="h-10 gap-1.5 font-semibold shadow-md shadow-primary/10">
                <Plus className="h-4 w-4" /> Nouvelle dépense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] overflow-y-auto border-slate-200 sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editing ? "Modifier la dépense" : "Enregistrer une dépense"}</DialogTitle>
                <DialogDescription>Attribuez un montant et une catégorie claire.</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSave} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Catégorie</Label>
                  <Select name="category" defaultValue={editing?.category ?? "Autre"}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATS.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Libellé</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="description" name="description" required defaultValue={editing?.description ?? ""} className="h-10 pl-9" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="amount">Montant (FCFA)</Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input id="amount" name="amount" type="number" required defaultValue={editing?.amount ?? ""} className="h-10 pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)} className="h-10" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={saveExpense.isPending} className="w-full">
                    {editing ? "Enregistrer" : "Valider la sortie"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4 sm:items-center">
        <Card className="flex items-center gap-4 border-slate-200/80 bg-background p-4 shadow-sm sm:col-span-2">
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-rose-600">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total des charges filtrées</p>
            <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">{formatXOF(total)}</p>
          </div>
        </Card>
        <div className="sm:col-span-2 sm:flex sm:justify-end">
          <div className="relative w-full sm:w-[220px]">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Select value={filter} onValueChange={(value) => setFilter(value as Expense["category"] | "Tous")}>
              <SelectTrigger className="h-11 bg-background pl-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Toutes catégories</SelectItem>
                {CATS.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/80 bg-background shadow-sm">
        <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((expense) => (
            <Card key={expense.id} className="border-slate-200 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${catStyles[expense.category]}`}>
                    {expense.category}
                  </Badge>
                  <h3 className="mt-2 truncate text-sm font-black text-slate-900">{expense.description}</h3>
                  <p className="mt-1 text-xs font-medium text-slate-500"><Calendar className="mr-1 inline h-3.5 w-3.5" /> {expense.date}</p>
                </div>
                <div className="text-right text-base font-black text-rose-600">- {formatXOF(expense.amount)}</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditing(expense); setOpen(true); }}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Modifier
                </Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => deleteExpense.mutate(expense.id)}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Supprimer
                </Button>
              </div>
            </Card>
          ))}
          {(filtered.length === 0 || isLoading || isError) && (
            <Card className="border-dashed border-slate-200 p-8 text-center font-medium text-slate-400 sm:col-span-2 xl:col-span-3">
              <Tag className="mx-auto mb-2 h-6 w-6 text-slate-300" />
              {emptyMessage}
            </Card>
          )}
        </div>

        <div className="hidden">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 text-left font-semibold">Catégorie</th>
                <th className="px-4 py-3 text-left font-semibold">Libellé</th>
                <th className="px-4 py-3 text-left font-semibold">Montant</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((expense) => (
                <tr key={expense.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${catStyles[expense.category]}`}>
                      {expense.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{expense.description}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-bold text-rose-600">- {formatXOF(expense.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs font-medium text-slate-500">
                    <Calendar className="mr-1.5 inline h-3.5 w-3.5 text-slate-400" />
                    {expense.date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(expense); setOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-destructive" onClick={() => deleteExpense.mutate(expense.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {(filtered.length === 0 || isLoading || isError) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center font-medium text-slate-400">
                    <Tag className="mx-auto mb-2 h-6 w-6 text-slate-300" />
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
