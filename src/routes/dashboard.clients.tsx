import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialClients, type Client } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/clients")({ component: ClientsPage });

function ClientsPage() {
  const [list, setList] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const filtered = useMemo(
    () => list.filter((c) => `${c.name} ${c.phone} ${c.city}`.toLowerCase().includes(search.toLowerCase())),
    [list, search]
  );

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name")), phone: String(fd.get("phone")),
      address: String(fd.get("address")), city: String(fd.get("city")),
    };
    if (editing) {
      setList((l) => l.map((c) => (c.id === editing.id ? { ...c, ...data } : c)));
      toast.success("Client modifié");
    } else {
      setList((l) => [{ id: `c${Date.now()}`, ...data, createdAt: new Date().toISOString().slice(0, 10), totalOrders: 0 }, ...l]);
      toast.success("Client ajouté");
    }
    setOpen(false); setEditing(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Clients"
        subtitle={`${list.length} clients enregistrés`}
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)}><Plus className="mr-1 h-4 w-4" /> Nouveau client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Modifier client" : "Nouveau client"}</DialogTitle>
                <DialogDescription>Informations du client</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSave} className="grid gap-4">
                {(["name", "phone", "address", "city"] as const).map((f) => (
                  <div key={f} className="space-y-2">
                    <Label htmlFor={f} className="capitalize">{f === "name" ? "Nom" : f === "address" ? "Adresse" : f === "city" ? "Ville" : "Téléphone"}</Label>
                    <Input id={f} name={f} required defaultValue={editing?.[f] ?? ""} />
                  </div>
                ))}
                <DialogFooter>
                  <Button type="submit">{editing ? "Enregistrer" : "Ajouter"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <Card className="p-5">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="pl-9" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr className="border-b"><th className="py-3 pr-4">Nom</th><th className="py-3 pr-4">Téléphone</th><th className="py-3 pr-4">Ville</th><th className="py-3 pr-4">Adresse</th><th className="py-3 pr-4">Commandes</th><th className="py-3 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/40">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{c.phone}</td>
                  <td className="py-3 pr-4">{c.city}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{c.address}</td>
                  <td className="py-3 pr-4 font-medium">{c.totalOrders}</td>
                  <td className="py-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { setList((l) => l.filter((x) => x.id !== c.id)); toast.success("Client supprimé"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-muted-foreground">Aucun client trouvé</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}