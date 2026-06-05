import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { initialEmployees, type Employee } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/employees")({ component: EmployeesPage });

function EmployeesPage() {
  const [list, setList] = useState<Employee[]>(initialEmployees);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { name: String(fd.get("name")), phone: String(fd.get("phone")), role: String(fd.get("role")) as Employee["role"] };
    if (editing) { setList((l) => l.map((x) => x.id === editing.id ? { ...x, ...data } : x)); toast.success("Employé modifié"); }
    else { setList((l) => [...l, { id: `em${Date.now()}`, ...data, joinedAt: new Date().toISOString().slice(0,10), active: true }]); toast.success("Employé ajouté"); }
    setOpen(false); setEditing(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Employés" subtitle={`${list.length} employés`}
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Nouvel employé</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouvel employé"}</DialogTitle></DialogHeader>
              <form onSubmit={onSave} className="grid gap-4">
                <div className="space-y-2"><Label>Nom</Label><Input name="name" required defaultValue={editing?.name ?? ""} /></div>
                <div className="space-y-2"><Label>Téléphone</Label><Input name="phone" required defaultValue={editing?.phone ?? ""} /></div>
                <div className="space-y-2"><Label>Rôle</Label>
                  <Select name="role" defaultValue={editing?.role ?? "Employé"}><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Propriétaire">Propriétaire</SelectItem>
                      <SelectItem value="Employé">Employé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter><Button type="submit">{editing ? "Enregistrer" : "Ajouter"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => (
          <Card key={e.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                  {e.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold">{e.name}</div>
                  <Badge variant={e.role === "Propriétaire" ? "default" : "secondary"} className="mt-1">{e.role}</Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(e); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => { setList((l) => l.filter((x) => x.id !== e.id)); toast.success("Supprimé"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <div>📞 {e.phone}</div>
              <div>Depuis {e.joinedAt}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}