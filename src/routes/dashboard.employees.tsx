import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, User, Phone, Shield, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    const data = { 
      name: String(fd.get("name")), 
      phone: String(fd.get("phone")), 
      role: String(fd.get("role")) as Employee["role"] 
    };

    if (editing) { 
      setList((l) => l.map((x) => x.id === editing.id ? { ...x, ...data } : x)); 
      toast.success("Profil de l'employé mis à jour"); 
    } else { 
      setList((l) => [
        { id: `em${Date.now()}`, ...data, joinedAt: new Date().toISOString().slice(0, 10), active: true },
        ...l
      ]); 
      toast.success("Nouvel employé ajouté à l'équipe"); 
    }
    setOpen(false); 
    setEditing(null);
  };

  const handleDelete = (employee: Employee) => {
    if (confirm(`Voulez-vous vraiment retirer ${employee.name} de la liste du personnel ?`)) {
      setList((l) => l.filter((x) => x.id !== employee.id));
      toast.success("Employé retiré du système");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader 
        title="Équipe & Personnel" 
        subtitle={`${list.length} collaborateurs enregistrés`}
        actions={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="shadow-md shadow-primary/10 gap-1.5 font-semibold h-10">
                <Plus className="h-4 w-4" /> Nouvel employé
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {editing ? "Modifier le profil" : "Enregistrer un collaborateur"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Configurez l'accès et les informations de contact de votre membre d'équipe.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={onSave} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Nom complet</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="name" name="name" required defaultValue={editing?.name ?? ""} placeholder="Ex: Moussa Sy" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Numéro de téléphone</Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input id="phone" name="phone" required defaultValue={editing?.phone ?? ""} placeholder="Ex: +221 70 123 45 67" className="pl-9 h-10 border-slate-200" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Rôle administratif</Label>
                  <Select name="role" defaultValue={editing?.role ?? "Employé"}>
                    <SelectTrigger className="h-10 border-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Propriétaire">Propriétaire (Gérant)</SelectItem>
                      <SelectItem value="Employé">Employé (Opérateur)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="pt-4 border-t border-slate-100">
                  <Button type="submit" className="w-full font-semibold">
                    {editing ? "Sauvegarder les changements" : "Ajouter à l'équipe"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* 👥 Grille des collaborateurs stylisée */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e) => {
          const initials = e.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
          const isOwner = e.role === "Propriétaire";

          return (
            <Card key={e.id} className="border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 bg-background overflow-hidden flex flex-col justify-between group">
              <div className="p-5">
                {/* Ligne du haut : Avatar & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3.5">
                    {/* Avatar stylisé aux coins arrondis */}
                    <div 
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md shadow-blue-600/10 uppercase" 
                      style={{ background: isOwner ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" }}
                    >
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 tracking-tight leading-snug group-hover:text-primary transition-colors">{e.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`px-2 py-0 text-[10px] font-bold rounded-full ${
                          isOwner ? "bg-slate-900 text-white border-transparent" : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                          {e.role}
                        </Badge>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Actif" />
                      </div>
                    </div>
                  </div>

                  {/* Actions discrètes au survol ou focus */}
                  <div className="flex items-center bg-slate-50 border border-slate-100 p-0.5 rounded-lg opacity-80 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
                      onClick={() => { setEditing(e); setOpen(true); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7 text-slate-400 hover:text-destructive hover:bg-white rounded-md transition-colors"
                      onClick={() => handleDelete(e)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Séparateur interne léger */}
                <div className="my-4 h-[1px] bg-slate-100" />

                {/* Coordonnées & Date */}
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span className="tracking-tight">{e.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Inscrit le {e.joinedAt}</span>
                  </div>
                </div>
              </div>

              {/* Petit bas de carte décoratif pour structurer */}
              <div className="h-1 w-full bg-slate-100 group-hover:bg-primary/20 transition-colors" />
            </Card>
          );
        })}
      </div>

      {list.length === 0 && (
        <Card className="p-12 text-center text-slate-400 border-dashed border-2 border-slate-200 shadow-none">
          <div className="flex flex-col items-center justify-center gap-2">
            <Users className="h-8 w-8 text-slate-300" />
            <p className="font-medium">Aucun membre d'équipe enregistré pour le moment</p>
          </div>
        </Card>
      )}
    </div>
  );
}