import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Calendar, Pencil, Phone, Plus, Trash2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { pressingApi } from "@/services/pressing-api";
import type { Employee } from "@/services/types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/employees")({ component: EmployeesPage });

function EmployeesPage() {
  const queryClient = useQueryClient();
  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: pressingApi.employees.list,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);

  const saveEmployee = useMutation({
    mutationFn: (payload: { id?: string; data: Partial<Employee> & Record<string, unknown> }) =>
      payload.id ? pressingApi.employees.update(payload.id, payload.data) : pressingApi.employees.create(payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(editing ? "Profil mis à jour" : "Employé ajouté");
      setOpen(false);
      setEditing(null);
    },
    onError: () => toast.error("Impossible d'enregistrer l'employé"),
  });

  const deleteEmployee = useMutation({
    mutationFn: pressingApi.employees.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employé retiré");
    },
    onError: () => toast.error("Impossible de retirer cet employé"),
  });

  const onSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    saveEmployee.mutate({
      id: editing?.id,
      data: {
        name: String(formData.get("name")),
        phone: String(formData.get("phone")),
        role: String(formData.get("role")) as Employee["role"],
        email: String(formData.get("email") || ""),
        joinedAt: String(formData.get("joinedAt") || editing?.joinedAt || new Date().toISOString().slice(0, 10)),
        active: editing?.active ?? true,
      },
    });
  };

  const emptyMessage = isLoading
    ? "Chargement de l'équipe..."
    : isError
      ? "Connectez votre API pour afficher l'équipe."
      : "Aucun membre d'équipe enregistré pour le moment.";

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 antialiased">
      <PageHeader
        title="Équipe & Personnel"
        subtitle={`${list.length} collaborateurs enregistrés`}
        actions={
          <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button className="h-10 gap-1.5 font-semibold shadow-md shadow-primary/10">
                <Plus className="h-4 w-4" /> Nouvel employé
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[92vh] overflow-y-auto border-slate-200 sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editing ? "Modifier le profil" : "Enregistrer un collaborateur"}</DialogTitle>
                <DialogDescription>Configurez les informations de contact du membre d'équipe.</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSave} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="name" name="name" required defaultValue={editing?.name ?? ""} className="h-10 pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="phone" name="phone" required defaultValue={editing?.phone ?? ""} className="h-10 pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={(editing as Employee & { email?: string } | null)?.email ?? ""} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="joinedAt">Date d'arrivee</Label>
                  <Input id="joinedAt" name="joinedAt" type="date" defaultValue={editing?.joinedAt ?? new Date().toISOString().slice(0, 10)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Rôle</Label>
                  <Select name="role" defaultValue={editing?.role ?? "Employé"}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Propriétaire">Propriétaire</SelectItem>
                      <SelectItem value="Employé">Employé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={saveEmployee.isPending} className="w-full">
                    {editing ? "Sauvegarder" : "Ajouter"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((employee) => {
          const initials = employee.name.split(" ").map((part) => part[0]).join("").slice(0, 2);
          const isOwner = employee.role === "Propriétaire";

          return (
            <Card key={employee.id} className="flex flex-col justify-between overflow-hidden border-slate-200/80 bg-background shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold uppercase text-white ${isOwner ? "bg-slate-900" : "bg-blue-600"}`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold tracking-tight text-slate-900">{employee.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className={isOwner ? "border-transparent bg-slate-900 text-white" : "border-blue-100 bg-blue-50 text-blue-700"}>
                          {employee.role}
                        </Badge>
                        {employee.active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center rounded-lg border border-slate-100 bg-slate-50 p-0.5">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(employee); setOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-destructive" onClick={() => deleteEmployee.mutate(employee.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="my-4 h-px bg-slate-100" />
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Inscrit le {employee.joinedAt}</span>
                  </div>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-100" />
            </Card>
          );
        })}
      </div>

      {(list.length === 0 || isLoading || isError) && (
        <Card className="border-2 border-dashed border-slate-200 p-12 text-center text-slate-400 shadow-none">
          <Users className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          <p className="font-medium">{emptyMessage}</p>
        </Card>
      )}
    </div>
  );
}
